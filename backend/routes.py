from dotenv import load_dotenv
from os import environ
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from functions import *
from app import app
CORS(app)



@app.route("/", methods=["GET"])
def test():
    return jsonify({"message":"Test passed"})

@app.route("/api/web-tools/reboot-power-on/", methods=["POST"])
def rebootOrPowerOn():
    
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
        
    
    try:
        req = reboot_system(irmc_ip)
        if req.startswith("ERROR"):
            return jsonify({"message":req,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Reboot/PowerON", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":req,"status":"ok","request-for":userInput,})
    except:
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})

@app.route("/api/web-tools/power-off/", methods=["POST"])
def powerOff():
    user_data = request.get_json()
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        task = powerOff_system(irmc_ip)
        if task.startswith("ERROR"):
            return jsonify({"message":task,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Power Off", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":task,"status":"ok","request-for":userInput,})
    except:
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})
        

@app.route("/api/web-tools/clear-sel/", methods=["POST"])
def clearSEL():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = clear_sel(irmc_ip, password)
        if task.startswith("ERROR"):
            return jsonify({"message":task,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Clear SEL", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":task,"status":"ok","request-for":userInput,})
    except:
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})

@app.route("/api/web-tools/get-info/", methods=["POST"])
def getInfo():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    
    try:
        power_status, password, model, uuid = check_power_status(irmc_ip)
        irmc = irmc_fw(irmc_ip,password)
        bios = bios_fw(irmc_ip,password)
        
        return jsonify({
            "message":"Unit info has been loaded.",
            "request-for":userInput,
            "data":{
                "unit":{
                    "BIOS": bios['bios'],
                    "Recovery-BIOS": bios['recovery_bios'],
                "iRMC": irmc['irmc_low_fw'],
                "irmc_low_fw": irmc["irmc_low_fw"],
                "irmc_low_state" : irmc["irmc_low_state"],
                "irmc_high_fw" : irmc["irmc_high_fw"],
                "irmc_high_state" : irmc["irmc_high_state"],
                "irmc_golden_fw" : irmc["irmc_golden_fw"],
                "irmc_golden_state" : irmc["irmc_golden_state"],
                "iRMC-IP": irmc_ip,
                "iRMC-Password": password,
                "Model": model,
                "Power-Status": power_status,
                "UUID": uuid,
                }
        }, "status":"ok"})
    except:
        return jsonify({"message":"ERROR! Can not load data. Please check it manually.", "status":"bad"})

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(usn=data['usn'], type_of_task=data['type_of_task'], status=data['status'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully'}), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [{'id': task.id, 'usn': task.usn, 'type_of_task': task.type_of_task, 'status': task.status} for task in tasks]
    return jsonify(tasks_list)

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200

@app.route('/tasks', methods=['DELETE'])
def delete_all_tasks():
    tasks = Task.query.all()
    if not tasks:
        return jsonify({'message': 'No tasks to delete'}), 404
    for task in tasks:
        db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'All tasks deleted successfully'}), 200

@app.route("/api/web-tools/sd-card-check/", methods=["POST"])
def sdCardCheck():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = get_sdcard_summary(get_sdcard_info(password, irmc_ip))
        
        if task:
            return jsonify({
            "message":"SD Card data has been loaded",
            "request-for":userInput,
            "data":{
                "sd-card":task}, "status":"ok"})
        else:
            return jsonify({f"message":"Získání informací o SD kartě se nezdařilo.","status":"bad"})
    except:
        return jsonify({"message":"ERROR! Please check it manually.", "status":"bad"})
    
    
@app.route("/api/web-tools/sel/", methods=["POST"])
def showSEL():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = get_sel(irmc_ip, password)
        
        return jsonify({
            "message":"SEL has been loaded",
            "request-for":userInput,
            "data":{
                "sel":task}, "status":"ok"}), 200
    except:
        return jsonify({"message":"ERROR! Please check it manually.", "status":"bad"})
    
@app.route("/api/web-tools/report/", methods=["POST"])
def report():
    user_data = request.get_json()
    
    if not user_data or 'subject' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    if not user_data or 'text' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    if uloz_data(user_data):
        return jsonify({"message":"Report saved", "status":"ok"})
    else:
        return jsonify({"message":"ERROR: Something went wrong", "status":"bad"})
    
@app.route("/api/web-tools/fw/", methods=["POST"])
def get_bmc_bios():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    print(userInput)
    
    if userInput.startswith(("EW")):
        return jsonify({"message":f"ERROR: Its USN. Please insert model.", "status":"bad"})

    if not userInput.startswith(("RX", "TX", "CX")):
        print(userInput)
        return jsonify({"message":f"ERROR: Unknown model - {userInput}", "status":"bad"})
    
    if not len(userInput) == 8:
        return jsonify({"message":f"ERROR: Unknown length of model - {userInput}", "status":"bad"})
    
    remote_path = ""
    rada = userInput[-2:]
    if rada in ["M5", "M6"]:
        remote_path="/mnt/M6_MM5_M1_PROD/M6/INI"
    else:
        remote_path='/mnt/M7_PROD/INI'
        
    if userInput in ["TX1330M6", "TX1320M6", "TX1310M6", "RX1310M6", "RX1320M6", "RX1330M6","RX1440M2"]:
        remote_path = "/mnt/M7_PROD/INI"
        
    if userInput in ["RX2450M2", "RX1440M2"]:
        remote_path = remote_path = "/mnt/M7_PROD/INI"
        
    if not rada in ["M5", "M6", "M7", "M1", "M4","M2"]:
        return jsonify({"message":f"ERROR: Unknown model - {userInput}", "status":"bad"})
    
    smaz_soubory()
    
    server = environ.get("SSH_SERVER")
    port = 22
    user = environ.get("SSH_USERNAME")
    password = environ.get("SSH_PASSWORD")
    local_path = os.path.join(os.getcwd(), "temp_files")
    
    ssh_client = create_ssh_client(server, port, user, password)
    scp_client = SCPClient(ssh_client.get_transport())
    
    try:
        txt_files = get_txt_files(ssh_client, remote_path)
        download_txt_files(ssh_client, scp_client, txt_files, remote_path, local_path)
    finally:
        scp_client.close()
        ssh_client.close()
        
    txt_files_forZIP = [f for f in os.listdir(local_path) if f.endswith('.txt')]
    base_names = [os.path.splitext(txt_file)[0] for txt_file in txt_files_forZIP]

    ssh_clientZIP = create_ssh_client(server, port, user, password)
    scp_clientZIP = SCPClient(ssh_clientZIP.get_transport())

    try:
        zip_files = get_zip_files(ssh_clientZIP, remote_path, base_names)
        download_zip_files(ssh_clientZIP, scp_clientZIP, zip_files, remote_path, local_path)
    finally:
        scp_clientZIP.close()
        ssh_clientZIP.close()
        
    bios = get_BIOS(userInput, rada) if get_BIOS(userInput, rada) else "unknown"
    irmc = get_BMC(userInput, rada) if get_BMC(userInput, rada) else "unknown"

    data_loaded = bios != "unknown" or irmc != "unknown"
    smaz_soubory()
        
    if data_loaded:
        return jsonify({
            "message":"FW info has been loaded",
            "request-for":userInput,
            "data":{
                "BIOS":bios,
                "iRMC": irmc}, "status":"ok"}), 200
    else:
        return jsonify({
            "message":"FW info has not been loaded",
            "request-for":userInput,
            "data":{
                "BIOS":"unknown",
                "iRMC": "unknown"}, "status":"bad"}), 200



@app.route("/api/web-tools/download-log/<usn>", methods=["GET"])
def download_log(usn):
    if usn.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"}),404
    
    if len(usn) != 10:
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"}),404
    
    irmc_ip = get_irmc_ip(usn)["ip"]
    
    if not is_server_reachable(irmc_ip):
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"}),404
    
    
    password = find_password(irmc_ip)
    
    if not check_api_password(password, irmc_ip):
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"}),404
        

    model, gen, modelgen = get_model_gen(irmc_ip,password)
    
    remote_path = ""
    
    if gen in ["M5", "M6"]:
        remote_path="/mnt/M6_MM5_M1_PROD/TestLog/"
    else:
        remote_path='/mnt/M7_PROD/TestLog/'
        
    if modelgen in ["TX1330M6", "TX1320M6", "TX1310M6", "RX1310M6", "RX1320M6", "RX1330M6","RX2450M2","RX1440M2"]:
        remote_path = "/mnt/M7_PROD/TestLog/"
        
    if not gen in ["M5", "M6", "M7", "M1", "M4", "M2"]:
        return jsonify({"message":f"ERROR: Unknown usn - {usn}", "status":"bad"}),404
    
    if stahnout_slozku(usn, cesta=remote_path) == False:
        return jsonify({"message":f"ERROR - LOG not found", "status":"bad"}), 404
    done, zip_path = zazipovat_slozku()
    
    if not done:
        return jsonify({"message":f"ERROR - not done", "status":"bad"}),404
    
    aktualni_adresar = os.path.dirname(os.path.abspath(__file__))
    cilova_slozka = os.path.join(aktualni_adresar, 'temp_files')
    file_name = usn+".zip"
    return send_from_directory(cilova_slozka, file_name, as_attachment=True)

@app.route("/api/web-tools/sar-flow/", methods=["POST"])
def getLastModified():
    user_data = request.get_json()
    
    if not user_data:
        return jsonify({"message":"ERROR: Missing data", "status":"bad"})
    
    if not 'mo' in user_data:
        return jsonify({"message":"ERROR: Missing MO", "status":"bad"})
    
    if not 'model' in user_data:
        return jsonify({"message":"ERROR: Missing model", "status":"bad"})
    
    mo = str(user_data['mo'])
    model = user_data['model']
    generation = model[-2:]
    
    return jsonify({"message" : "Result:", "status": "ok", "data" : {
        "sar" : check_sar_on_server(mo, generation, model),
        "cpn": check_flow_on_server(mo, generation, model)
    }})
    
    
@app.route('/api/web-tools/mo-positions', methods=['GET'])
def get_sorted_positions():
    mo = request.args.get('mo')
    units = []
    unsorted = {}

    url = "http://172.25.32.4/api/v2/monitor/get-data"
    response = requests.get(url=url, verify=False)
    data = response.json()

    for i in data["data"]["units_data"]:
        units.append(i)

    for i in units:
        if data["data"]["units_data"][str(i)]["WorkOrder"] == mo:
            unsorted[i] = {
                "position": data["data"]["units_data"][str(i)]["position"],
                "mo": mo
            }

    def extract_position(item):
        position = item["position"]
        line, trolley, slot = map(int, position.split('-'))
        return line, trolley, slot

    sorted_items = sorted(unsorted.items(), key=lambda x: extract_position(x[1]))

    output = [f"{info['mo']} | {unit} | {info['position']}" for unit, info in sorted_items]

    output_format = request.args.get('format', 'text')
    if output_format == 'json':
        return jsonify(output)
    else:
        return "\n".join(output)
    
@app.route("/api/web-tools/reset-irmc/", methods=["POST"])
def reset_irmc():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad", "data":{"reset-response": ""}})
    
    os_ip = ""
    userInput = user_data['userData']
    if userInput.startswith("172"):
        os_ip = userInput
    else:
        os_ip = get_os_ip(userInput)
        if os_ip == "":
            return jsonify({"message":"ERROR: Tool could not find OS IP for this USN.", "status":"bad", "data":{"reset-response": ""}})
        
    if check_irmc_availability(os_ip):
        return jsonify({"message":"ERROR: This is iRMC IP! Not OS IP! Please enter correct OS IP!", "status":"bad", "data":{"reset-response": ""}})
    
    if not check_ssh_availability(os_ip):
        return jsonify({"message":f"ERROR: OS IP '{os_ip}' has been loaded but IP is not responding...", "status":"bad", "data":{"reset-response": ""}})
    
    command_return_code = {}
    
    # SSH připojení
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(os_ip, username='root', password='rootroot')

        # 1. Vytvoření složky temp
        print("Creating 'temp' directory...")
        execute_ssh_command(ssh, "mkdir -p /root/temp")

        # 2. Kopírování ZIP souboru do temp
        print("Copying ZIP file to temp...")
        execute_ssh_command(ssh, "cp /mnt/Data/Tools/Tools_v1.22.zip /root/temp/")

        # 3. Rozbalení ZIP souboru
        print("Unzipping file...")
        execute_ssh_command(ssh, "unzip /root/temp/Tools_v1.22.zip -d /root/temp/")

        # 4. Nastavení práv pro složku Tools
        print("Setting permissions...")
        execute_ssh_command(ssh, "chmod -R 777 /root/temp/Tools")

        # 5. Spuštění příkazů ve složce Tools
        print("Running commands...")
        commands = [
            "echo KrResetToDefault=2 > /root/temp/Tools/i.ini",
            "./IPMIVIEW64 ini=/root/temp/Tools/i.ini",
            "ipmitool user set password 2 Password@123"
        ]
        
        for command in commands:
            print(f"Executing: {command}")
            output, errors, return_code = execute_ssh_command(ssh, f"cd /root/temp/Tools && {command}")
            print(f"Output: {output}")
            if errors:
                print(f"Errors: {errors}")
                
            if not return_code == 0:
                return jsonify({
                    "status": "bad",
                    "data":{"reset-response": command_return_code},
                    "message":"iRMC has not been successfully restored to default."
                })
            
            # Vypsání návratového kódu
            print(f"Return code: {return_code}")
            command_return_code[command] = return_code

            # Pauza mezi příkazy
            time.sleep(1)  

    finally:
        ssh.close()
        return jsonify({
        "status": "ok",
        "data":{"reset-response": command_return_code},
        "message":"iRMC has been successfully restored to default."
    })
    
    