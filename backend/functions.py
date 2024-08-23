import os, zipfile
import shutil
import requests
from bs4 import BeautifulSoup
import socket
import json
from models import Task, db
import paramiko
from scp import SCPClient
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def find_password(ip):
    
    pws = {
        "M2": "Password@123",
        "M5": "admin",
        "M7": "Password@123",
        "RX2530M6": "admin",
        "RX2540M6": "admin",
        "RX4770M6": "admin",
        "TX1310M6": "Password@123",
        "TX1320M6": "Password@123",
        "TX1330M6": "Password@123",
        "RX1310M6": "Password@123",
        "RX1320M6": "Password@123",
        "RX1330M6": "Password@123",
        "RX1330M5S": "admin",
        "RX2530M7S": "Password@123",
    }
    
    def get_password(model):
        return pws.get(model, "Password@123")
    
    # API request pro zjisteni modelu a rady(M5,M6,M7,M2)
    url = f"https://{ip}/redfish/v1"
    auth = ('', '')
    response = requests.get(url, auth=auth, verify=False)
    data = response.json()["Oem"]["ts_fujitsu"]["AutoDiscoveryDescription"]["ServerNodeInformation"]["Model"]
    rada_serveru = data.split()[2]
    model = data.split()[1]+rada_serveru
    
    password = ""
    if rada_serveru == "M7" or rada_serveru == "M2":
        password = "Password@123"
    elif rada_serveru == "M5":
        password = "admin"
    else:
        password = get_password(model)
    
    
    return password

def get_irmc_ip(usn):
  
  url = "http://172.25.32.4/api/v2/monitor/get-irmc-ip"
  
  body = {"usn": usn}

  try:
    response = requests.post(url, json=body)
    return response.json()
  except requests.exceptions.RequestException as e:
    return response.json()

def check_power_status(ip):
    
    pws = {
        "M2": "Password@123",
        "M5": "admin",
        "M7": "Password@123",
        "RX2530M6": "admin",
        "RX2540M6": "admin",
        "RX4770M6": "admin",
        "TX1310M6": "Password@123",
        "TX1320M6": "Password@123",
        "TX1330M6": "Password@123",
        "RX1310M6": "Password@123",
        "RX1320M6": "Password@123",
        "RX1330M6": "Password@123",
        "RX1330M5S": "admin",
        "RX2530M7S": "Password@123",
    }
    
    def get_password(model):
        return pws.get(model, "Password@123")
    
    url = f"https://{ip}/redfish/v1"
    auth = ('', '')
    response = requests.get(url, auth=auth, verify=False)
    data = response.json()["Oem"]["ts_fujitsu"]["AutoDiscoveryDescription"]["ServerNodeInformation"]["Model"]
    rada_serveru = data.split()[2]
    model = data.split()[1]+rada_serveru
    # print(f"kontrola: model-{model}, rada-{rada_serveru}")
    
    password = ""
    if rada_serveru == "M7" or rada_serveru == "M2":
        password = "Password@123"
    elif rada_serveru == "M5":
        password = "admin"
    else:
        password = get_password(model)
    
    url = f"https://{ip}/redfish/v1/Systems/0"
    auth = ('admin', password)
    response = requests.get(url, auth=auth, verify=False)
    power_status = response.json()['PowerState']
    uuid = response.json()['UUID']

    return power_status, password, model, uuid

def reboot_system(irmc_ip):
    try:
        pwr_status, password, model, uuid = check_power_status(irmc_ip)
    
        if pwr_status == "Off":
            url = f'https://{irmc_ip}/redfish/v1/Systems/0/Actions/Oem/FTSComputerSystem.Reset'
            auth = ('admin', password)
            data = {"FTSResetType": "PowerOn"}
            requests.post(url, json=data, verify=False, auth=auth)
            return "The unit is switched off. Switching on the unit.."
        elif pwr_status == "On":
            url = f'https://{irmc_ip}/redfish/v1/Systems/0/Actions/Oem/FTSComputerSystem.Reset'
            auth = ('admin', password)
            data = {"FTSResetType": "PowerCycle"}
            requests.post(url, json=data, verify=False, auth=auth)
            return "Rebooting the unit.."
    except:
        return "ERROR: Connection to iRMC failed. Please check it."
    
    
def powerOff_system(irmc_ip):
    try:
        pwr_status, password, model, uuid = check_power_status(irmc_ip)
    
        if pwr_status == "Off":
            return "The unit is already switched off."
        elif pwr_status == "On":
            url = f'https://{irmc_ip}/redfish/v1/Systems/0/Actions/Oem/FTSComputerSystem.Reset'
            auth = ('admin', password)
            data = {"FTSResetType": "PowerOff"}
            requests.post(url, json=data, verify=False, auth=auth)
            return "Turning off the unit.."
    except:
        return "ERROR: Connection to iRMC failed. Please check it manually."

def clear_sel(irmc, password):
    user = "admin"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    url = "https://{}/redfish/v1/Managers/iRMC/LogServices/SystemEventLog/Actions/LogService.ClearLog".format(irmc)
    response = requests.post(url, headers=headers, auth=(user, password), verify=False)

    if response.status_code != 204:
        return "ERROR: Failed to clear the system event log from the iRMC at {}".format(irmc)
    else:
        return "SEL has been cleared successfully."
    
def get_system_fw_info(irmc, user, password):
    session = requests.Session()
    session.verify = False
    headers = {'Accept': 'application/json',
               'Content-Type': 'application/json'}
    payload = {'UserName': user, 'Password': password}
    sessions_url = "https://{}/redfish/v1/SessionService/Sessions".format(irmc)
    response = session.post(
        sessions_url,
        headers=headers,
        auth=(user, password),
        data=json.dumps(payload)
    )
    if response.status_code != 201:
        return "ERROR: Could not establish a session to the iRMC"
    session.headers.update({"X-Auth-Token": response.headers["X-Auth-Token"]})
    session_info = response.headers["Location"]

    url = "https://{}/redfish/v1/Systems/0/Oem/ts_fujitsu/FirmwareInventory".format(
        irmc)
    response = session.get(url)
    status_code = response.status_code
    if status_code != 200 and status_code != 202 and status_code != 204:
        # session.delete("https://{0}{1}".format(irmc, session_info))
        return "The request failed (url: {0}, error: {1})".format(
            url, response.json()['error']['message'])
        

    data = response.json()
    bios = ""
    if (data['SystemBIOS'] == "Version1.0"):
        bios = "Unknown/1.0"
    else:
        bios = data['SystemBIOS']
    return data

def addNewTask(userInput, type_of_task, status):
    new_task = Task(usn=userInput, type_of_task=type_of_task, status=status)
    db.session.add(new_task)
    db.session.commit()
    
def get_sdcard_info(password, ip_address):

  url = f"https://{ip_address}/redfish/v1/Systems/0/Oem/ts_fujitsu/SDCard"
  auth = requests.auth.HTTPBasicAuth("admin", password)

  try:
    response = requests.get(url, auth=auth, verify=False)
    if response.status_code == 200:
      data = json.loads(response.text)
      return data
    else:
      print(f"Chyba při získávání informací o SD kartě: {response.status_code}")
      return None
  except Exception as e:
    print(f"Neočekávaná chyba: {e}")
    return None

def get_sdcard_summary(data):

  if not data or "@odata.id" not in data:
    return None

  summary = {
    "Id": data.get("Id"),
    # "Name": data.get("Name"),
    "Status": data.get("Status"),
    "Inserted": data.get("Inserted"),
    "Mounted": data.get("Mounted"),
    "CapacityMB": data.get("CapacityMB"),
    "FreeSpacePercent": data.get("FreeSpacePercent"),
    "FreeSpaceMB": data.get("FreeSpaceMB"),
  }

  return summary


def get_sel(irmc, password):
    user = "admin"
    ascend = False
    event_id = None

    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

    response = requests.get(
        f"https://{irmc}/redfish/v1/Managers/iRMC/LogServices/SystemEventLog/Entries",
        headers=headers,
        auth=(user, password),
        verify=False
    )

    if response.status_code != 200:
        return {
            "error": "Failed to get the system event log information from the iRMC",
            "details": response.json().get('error', {}).get('message', 'No details provided')
        }

    response_json = response.json()
    sel_entries_list = response_json.get('Members', [])

    if ascend:
        sel_entries_list.reverse()

    if event_id is None:
        sel_entries_json = [
            {
                "ID": entry["Id"],
                "DateTime": entry["Created"],
                "Severity": entry['Severity'],
                "Event": entry["Message"]
            }
            for entry in sel_entries_list
        ]
        return sel_entries_json
    else:
        for entry in sel_entries_list:
            if int(entry['Id']) == event_id:
                return {
                    "ID": entry["Id"],
                    "DateTime": entry["Created"],
                    "Severity": entry['Severity'],
                    "Event": entry["Message"]
                }
        
        return {
            "error": "Could not find the specified event",
            "event_id": event_id
        }
        
def uloz_data(data):
  try:
    slovnik_jako_retezec = str(data)
    with open('report.txt', 'a') as soubor:
        soubor.write(slovnik_jako_retezec + '\n')
        return True
  except Exception as e:
    print(f"Chyba při ukládání dat: {e}")
    return False

import socket

def is_server_reachable(ip_address, port=80):
  try:
    # Using socket
    s = socket.create_connection((ip_address, port), timeout=5)
    s.close()
    return True
  except (socket.timeout, socket.error):
    try:
      # Using requests (for HTTP-based checks)
      response = requests.get(f"http://{ip_address}:{port}", timeout=5)
      return response.status_code == 200
    except requests.exceptions.RequestException:
      return False
  
def change_password(irmc_ip, default_password, new_password="Password@123"):
    etag = ""
    auth_token = ""
    
    # 1 ziskani tokenu
    url = f"https://{irmc_ip}/redfish/v1/SessionService/Sessions"
    headers = {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,cs;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-usage": "WebUI"
    }
    data = {
        "UserName": "admin",
        "Password": default_password,
        "TotpCode": ""
    }
    response = requests.post(url, headers=headers, json=data, verify=False)
    if not response.status_code == 201 or response.status_code == 200:
        return False
    auth_token = response.headers['X-Auth-Token']
    
    
    # 2 ziskani etagu pomoci tokenu
    url = f"https://{irmc_ip}/redfish/v1/AccountService/Accounts/2"
    headers = {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,cs;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-auth-token": auth_token,
        "x-usage": "WebUI"
    }
    auth = ('admin', default_password)
    response = requests.get(url=url, headers=headers, verify=False, auth=auth)
    if response.status_code >= 300:
        return False
    etag = response.json()['@odata.etag']
    
    # 3 zmena hesla
    url = f"https://{irmc_ip}/redfish/v1/AccountService/Accounts/2"
    headers = {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,cs;q=0.8",
        "cache-control": "max-age=0",
        "content-type": "application/json",
        "if-match": etag,
        "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-auth-token": auth_token,
        "x-usage": "WebUI"
    }
    data = {
        "Password": new_password
    }
    response = requests.patch(url, headers=headers, json=data, verify=False)
    if response.status_code >= 300:
        return False
    print(f"\n*** Password has been changed from: {default_password} to: {new_password} ***\n")
    return True

def check_api_password(password, ip_address):
    default_passwords = ["Admin-lzH5p5POBYkJ","admin","Password@123","Admin-SguvlCskXm3L","Admin-2rcJuDoEOF/c","Admin-CMKPYp6ekoMs","Admin-Anl6vQ101tbz", "Admin-OFQE/TRz0lNy","Admin-1InmNvDF1ahY","Admin-WUey/ohT/pte","Admin-SguvlCskXm3L","Admin-SkIXNR/TAP9t","Admin-6FLdkraSUuTi","adminADMIN11", "Admin-GOtgGbPE24Lb","Admin-Mc5FyslyQqXd","Admin-w5fT5iyNXfAv"]
    
    # 1st try normal password
    api_url = f"https://{ip_address}/redfish/v1/Systems/0/Oem/ts_fujitsu/SDCard"
    auth = requests.auth.HTTPBasicAuth("admin", password)
    response = requests.get(api_url, auth=auth, verify=False)
    
    if response.status_code == 200:
        print(f"Password is: {password}")
        return True
    else:
        print(f"Password is not: {password}")
    
    # if normal pw doesnt work then try to change default pw
    if response.status_code != 200:
        for pw in default_passwords:
            if change_password(irmc_ip=ip_address, default_password=pw, new_password=password):
                
                return True
            
    print("\n*** Error while checking password ***\n")
    return False

def loadUUID(ip,password):
    try:
        url = f"https://{ip}/redfish/v1/Systems/0"
        auth = ('admin', password)
        response = requests.get(url, auth=auth, verify=False)
        unit_uuid = response.json()['UUID']
        return unit_uuid
    except:
        return False
    
def get_BIOS(model, rada):
    target = ""
    file = ""
    if rada == "M7":
        file = "fw.toml"
        target = f'[BIOS.{model}]'
    else:
        file = "fw.ini"
        target = f'[{model}_BIOS]'
        
    if model == "TX1330M6" or model == "TX1320M6" or model == "TX1310M6" or model == "RX1310M6" or model == "RX1320M6" or model == "RX1330M6":
        file = "fw.toml"
        target = f'[BIOS.{model}]'
        
    if model == "RX2450M2":
        file = "fw.toml"
        target = f'[BIOS.{model}]'
        
    
    
    file_name = najdi_zip_soubor()
    with zipfile.ZipFile(f'temp_files/{file_name}', 'r') as zip_ref:
        with zip_ref.open(f'INI/{file}', 'r') as file:
            text = file.read().decode('utf-8')  # Dekódování do UTF-8
            
            lines = text.split('\n')
            
            
            for i, line in enumerate(lines):
                if line.strip() == target:
                    if i + 2 < len(lines):
                        original_string = lines[i + 2]
                        cleaned_string = original_string.split("=")[1].strip('"')
                        return cleaned_string
                    else:
                        print("Řádek, který je o dva níže, neexistuje.")
                        return False
                    break
            else:
                print(f"Hledaný řádek pro {target} nebyl nalezen.")
                return False
            
def get_BMC(model, rada):
    target = ""
    file = ""
    if rada == "M7":
        file = "fw.toml"
        target = f'[BMC.{model}]'
    else:
        file = "fw.ini"
        target = f'[{model}_IRMC]'
        
    if model == "TX1330M6" or model == "TX1320M6" or model == "TX1310M6" or model == "RX1310M6" or model == "RX1320M6" or model == "RX1330M6":
        file = "fw.toml"
        target = f'[BMC.{model}]'
        
    if model == "RX2450M2":
        file = "fw.toml"
        target = f'[BMC.{model}]'
        
    
    
    file_name = najdi_zip_soubor()
    with zipfile.ZipFile(f'temp_files/{file_name}', 'r') as zip_ref:
        with zip_ref.open(f'INI/{file}', 'r') as file:
            text = file.read().decode('utf-8')
            lines = text.split('\n')
            
            
            for i, line in enumerate(lines):
                if line.strip() == target:
                    if i + 2 < len(lines):
                        original_string = lines[i + 2]
                        cleaned_string = original_string.split("=")[1].strip('"')
                        return cleaned_string
                    else:
                        print("Řádek, který je o dva níže, neexistuje.")
                        return False
                    break
            else:
                print(f"Hledaný řádek pro {target} nebyl nalezen.")
                return False
            
def delete_file(cesta_k_souboru):
    if os.path.exists(cesta_k_souboru):
        os.remove(cesta_k_souboru)
        # print(f'Soubor {cesta_k_souboru} byl úspěšně smazán.')
    else:
        print(f'Soubor {cesta_k_souboru} neexistuje.')
        
def smaz_soubory():
    smernice_k_sluzbe = os.path.join(os.getcwd(), "temp_files")
    for soubor in os.listdir(smernice_k_sluzbe):
      cesta_k_souboru = os.path.join(smernice_k_sluzbe, soubor)
      if os.path.isfile(cesta_k_souboru) and (soubor.endswith(".txt") or soubor.endswith(".zip")):
        os.remove(cesta_k_souboru)
        
def create_ssh_client(server, port, user, password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

def get_txt_files(ssh_client, remote_path):
    stdin, stdout, stderr = ssh_client.exec_command(f'ls {remote_path}/*.txt')
    txt_files = stdout.read().split()
    
    txt_files = [file.decode('utf-8') for file in txt_files]
    return [os.path.basename(file) for file in txt_files]

def download_txt_files(ssh_client, scp_client, txt_files, remote_path, local_path):
    for txt_file in txt_files:
        remote_file = f'{remote_path}/{txt_file}'
        local_file = os.path.join(local_path, txt_file)
        scp_client.get(remote_file, local_file)
        
def create_ssh_client(server, port, user, password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

def get_zip_files(ssh_client, remote_path, base_names):
    
    stdin, stdout, stderr = ssh_client.exec_command(f'ls {remote_path}/*.zip')
    zip_files = stdout.read().split()
    zip_files = [file.decode('utf-8') for file in zip_files]
    
    
    filtered_zip_files = [os.path.basename(file) for file in zip_files if os.path.basename(file).replace('.zip', '') in base_names]
    return filtered_zip_files

def download_zip_files(ssh_client, scp_client, zip_files, remote_path, local_path):
    for zip_file in zip_files:
        remote_file = f'{remote_path}/{zip_file}'
        local_file = os.path.join(local_path, zip_file)
        scp_client.get(remote_file, local_file)
        
def najdi_zip_soubor():
    # Získání aktuálního pracovního adresáře
    aktu_adresar = os.getcwd()

    # Sestavení cesty ke složce s ZIP soubory (relativní cesta)
    cesta_ke_soubore = os.path.join(aktu_adresar, "temp_files")

    for soubor in os.listdir(cesta_ke_soubore):
        if soubor.endswith(".zip"):
            return soubor
    return None

def irmc_fw(ip, password):
    url = f"https://{ip}/redfish/v1/Managers/iRMC/Oem/ts_fujitsu/iRMCConfiguration/FWUpdate"
    auth = ('admin', password)
    response = requests.get(url, auth=auth, verify=False)
    
    # Low
    irmc_low_fw = response.json()['iRMCFwImageLow']['FirmwareVersion']
    irmc_low_state = response.json()['iRMCFwImageLow']['FirmwareRunningState']
    
    # High
    irmc_high_fw = response.json()['iRMCFwImageHigh']['FirmwareVersion']
    irmc_high_state = response.json()['iRMCFwImageHigh']['FirmwareRunningState']
    
    # Golden
    try:
        irmc_golden_fw = response.json()['iRMCFwImageGolden']['FirmwareVersion']
        irmc_golden_state = response.json()['iRMCFwImageGolden']['FirmwareImageState']
    except:
        irmc_golden_fw = ""
        irmc_golden_state = ""
        
    irmc_fw = {
        "irmc_low_fw" : irmc_low_fw,
        "irmc_low_state" : irmc_low_state,
        "irmc_high_fw" : irmc_high_fw,
        "irmc_high_state" : irmc_high_state,
        "irmc_golden_fw" : irmc_golden_fw,
        "irmc_golden_state" : irmc_golden_state
        
    }
        
    return irmc_fw

def bios_fw(ip, password):
    url = f"https://{ip}/redfish/v1/Systems/0/Oem/ts_fujitsu/FirmwareInventory"
    auth = ('admin', password)
    response = requests.get(url, auth=auth, verify=False)
    bios = response.json()["SystemBIOS"]
    
    url = f"https://{ip}/redfish/v1/Systems/0/Bios"
    auth = ('admin', password)
    response = requests.get(url, auth=auth, verify=False)
    recovery_bios = response.json()["Oem"]["ts_fujitsu"]["RecoveryBiosVersion"]
    
    bios_fw = {
        "bios" : bios,
        "recovery_bios" : recovery_bios
    }
    
    return bios_fw


def zazipovat_slozku():
    # Získání cesty ke složce 'temp_files'
    aktualni_adresar = os.path.dirname(os.path.abspath(__file__))
    cilova_slozka = os.path.join(aktualni_adresar, 'temp_files')

    # Získání seznamu složek v 'temp_files'
    slozky = [d for d in os.listdir(cilova_slozka) if os.path.isdir(os.path.join(cilova_slozka, d))]
    
    # Ověření, že existuje pouze jedna složka
    if len(slozky) != 1:
        print("Ve složce 'temp_files' není přesně jedna složka, nelze pokračovat.")
        return False

    # Jméno složky a cesta k ní
    jmeno_slozky = slozky[0]
    cesta_slozky = os.path.join(cilova_slozka, jmeno_slozky)

    # Cesta k ZIP souboru (bude uložen ve stejné složce 'temp_files')
    zip_cesta = os.path.join(cilova_slozka, jmeno_slozky)

    # Zazipování složky
    shutil.make_archive(zip_cesta, 'zip', cilova_slozka, jmeno_slozky)
    print(f"Složka {jmeno_slozky} byla úspěšně zazipována do {zip_cesta}.zip")

    return True, zip_cesta

def stahnout_slozku(jmeno_slozky, server='172.25.8.2', cesta='/mnt/M7_PROD/TestLog/', username='davidd', password='DavidDang2641@@@'):
    # Inicializace SSH klienta
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(server, username=username, password=password)
        
        # Zkontrolujeme, zda složka existuje pomocí 'test -d'
        stdin, stdout, stderr = ssh.exec_command(f'test -d {os.path.join(cesta, jmeno_slozky)} && echo "EXISTUJE" || echo "NEEXISTUJE"')
        if stdout.read().decode().strip() != "EXISTUJE":
            print(f"Složka {jmeno_slozky} neexistuje na serveru.")
            return False
         
        print("Snad to tady nepokracuje")   

        # Získání cesty ke složce 'temp_files'
        aktualni_adresar = os.path.dirname(os.path.abspath(__file__))
        cilova_slozka = os.path.join(aktualni_adresar, 'temp_files')
        
        # Pokud složka 'temp_files' neexistuje, vytvoříme ji
        if not os.path.exists(cilova_slozka):
            os.makedirs(cilova_slozka)
        else:
            # Vyprázdnění složky 'temp_files', pokud již existuje
            for filename in os.listdir(cilova_slozka):
                file_path = os.path.join(cilova_slozka, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)  # Odstraní soubor nebo symbolický odkaz
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)  # Odstraní složku a její obsah
                except Exception as e:
                    print(f"Chyba při mazání souboru {file_path}: {e}")

        # Připojíme se pomocí SCP a stáhneme složku do 'temp_files'
        with SCPClient(ssh.get_transport()) as scp:
            scp.get(os.path.join(cesta, jmeno_slozky), local_path=cilova_slozka, recursive=True)
            print(f"Složka {jmeno_slozky} byla úspěšně stažena do {cilova_slozka}.")
            

        return True
    except Exception as e:
        print(f"Chyba: {str(e)}")
        return False
    finally:
        ssh.close()
        
def get_model_gen(ip, password):
    url=f"https://{ip}/redfish/v1"
    auth = ('admin', password)
    response = requests.get(url, auth=auth, verify=False)
    full_model = response.json()["Oem"]["ts_fujitsu"]["AutoDiscoveryDescription"]["ChassisInformation"]["Model"]
    
    parts = full_model.split()
    model = parts[1]
    gen = parts[2]
    modelgen = model+gen
    return model, gen, modelgen