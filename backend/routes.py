from dotenv import load_dotenv
from os import environ
from flask import Flask, jsonify, request
from flask_cors import CORS
from functions import *
from app import app
from models import Task, db
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
        addNewTask(userInput, "Reboot/PowerON", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Reboot/PowerON", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "Reboot/PowerON", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "Reboot/PowerON", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "Reboot/PowerON", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "Reboot/PowerON", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
        
    
    try:
        req = reboot_system(irmc_ip)
        if req.startswith("ERROR"):
            addNewTask(userInput, "Reboot/PowerON", "bad")
            return jsonify({"message":req,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Reboot/PowerON", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":req,"status":"ok","request-for":userInput,})
    except:
        addNewTask(userInput, "Reboot/PowerON", "bad")
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})

@app.route("/api/web-tools/power-off/", methods=["POST"])
def powerOff():
    user_data = request.get_json()
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Power Off", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "Power Off", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "Power Off", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "Power Off", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "Power Off", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        task = powerOff_system(irmc_ip)
        if task.startswith("ERROR"):
            addNewTask(userInput, "Power Off", "bad")
            return jsonify({"message":task,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Power Off", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":task,"status":"ok","request-for":userInput,})
    except:
        addNewTask(userInput, "Power Off", "bad")
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})
        

@app.route("/api/web-tools/clear-sel/", methods=["POST"])
def clearSEL():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Clear SEL", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "Clear SEL", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "Clear SEL", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "Clear SEL", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "Clear SEL", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = clear_sel(irmc_ip, password)
        if task.startswith("ERROR"):
            addNewTask(userInput, "Clear SEL", "bad")
            return jsonify({"message":task,"status":"bad"})
        new_task = Task(usn=userInput, type_of_task="Clear SEL", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({f"message":task,"status":"ok","request-for":userInput,})
    except:
        addNewTask(userInput, "Clear SEL", "bad")
        return jsonify({"message":"ERROR: Something went wrong. Please check it manually.", "status":"bad"})

@app.route("/api/web-tools/get-info/", methods=["POST"])
def getInfo():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Get Info", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "Get Info", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "Get Info", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    
    try:
        power_status, password, model = check_power_status(irmc_ip)
        task = get_system_fw_info(irmc_ip, "admin", password)
        uuid = loadUUID(irmc_ip, password)
        
        new_task = Task(usn=userInput, type_of_task="Get Info", status="ok")
        db.session.add(new_task)
        db.session.commit()
        return jsonify({
            "message":"Unit info has been loaded.",
            "request-for":userInput,
            "data":{
                "unit":{
                    "BIOS": task['SystemBIOS'],
                "iRMC": task['BMCFirmware'],
                "iRMC-IP": irmc_ip,
                "iRMC-Password": password,
                "Model": model,
                "Power-Status": power_status,
                "UUID": uuid,
                }
        }, "status":"ok"})
    except:
        addNewTask(userInput, "Get Info", "bad")
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
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "SD Card Check", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "SD Card Check", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "SD Card Check", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = get_sdcard_summary(get_sdcard_info(password, irmc_ip))
        
        if task:
            addNewTask(userInput, "SD Card check", "ok")
            return jsonify({
            "message":"SD Card data has been loaded",
            "request-for":userInput,
            "data":{
                "sd-card":task}, "status":"ok"})
        else:
            addNewTask(userInput, "SD Card check", "bad")
            return jsonify({f"message":"Získání informací o SD kartě se nezdařilo.","status":"bad"})
    except:
        addNewTask(userInput, "SD Card check", "bad")
        return jsonify({"message":"ERROR! Please check it manually.", "status":"bad"})
    
    
@app.route("/api/web-tools/sel/", methods=["POST"])
def showSEL():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA", "EWBS")):
        addNewTask(userInput, "Show SEL", "bad")
        return jsonify({"message":"ERROR: Sorry, Tool is not able to find MAC in SFCS for this model. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Show SEL", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        try:
            irmc_ip = get_irmc_ip(userInput)["ip"]
        except:
            addNewTask(userInput, "Show SEL", "bad")
            return jsonify({"message":"Can not get the iRMC IP. Please check it manually.", "status":"bad"})
    else:
        addNewTask(userInput, "Show SEL", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    if not is_server_reachable(irmc_ip):
        addNewTask(userInput, "Show SEL", "bad")
        return jsonify({"message":f"ERROR: iRMC IP {irmc_ip} is not reachable. Please check it.", "status":"bad"})
    
    if not check_api_password(find_password(irmc_ip), irmc_ip):
            addNewTask(userInput, "Show SEL", "bad")
            return jsonify({"message":f"iRMC Password is not 'admin' or 'Password@123'. Please check it.", "status":"bad"})
    
    try:
        password = find_password(irmc_ip)
        task = get_sel(irmc_ip, password)
        
        
        addNewTask(userInput, "Show SEL", "ok")
        return jsonify({
            "message":"SEL has been loaded",
            "request-for":userInput,
            "data":{
                "sel":task}, "status":"ok"}), 200
        
        if task:
            addNewTask(userInput, "Show SEL", "ok")
            return jsonify({
            "message":"SEL has been loaded",
            "request-for":userInput,
            "data":{
                "sel":task}, "status":"ok"}), 200
        else:
            addNewTask(userInput, "Show SEL", "bad")
            return jsonify({f"message":"Load SEL Failed","status":"bad"})
    except:
        addNewTask(userInput, "Show SEL", "bad")
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
        print("Uložení dat se nezdařilo.")
        return jsonify({"message":"ERROR: Something went wrong", "status":"bad"})
    
@app.route("/api/web-tools/fw/", methods=["POST"])
def get_bmc_bios():
    user_data = request.get_json()
    
    if not user_data or 'userData' not in user_data:
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EW")):
        return jsonify({"message":f"ERROR: Its USN. Please insert model.", "status":"bad"})

    if not userInput.startswith(("RX", "TX", "CX")):
        return jsonify({"message":f"ERROR: Unknown model- {userInput}", "status":"bad"})
    
    remote_path = ""
    rada = userInput[-2:]
    if rada in ["M5", "M6"]:
        remote_path="/mnt/M6_MM5_M1_PROD/M6/INI"
    else:
        remote_path='/mnt/M7_PROD/INI'
        
    if userInput in ["TX1330M6", "TX1320M6", "TX1310M6", "RX1310M6", "RX1320M6", "RX1330M6"]:
        remote_path = "/mnt/M7_PROD/INI"
        
    if userInput in ["RX2450M2"]:
        remote_path = remote_path = "/mnt/M7_PROD/INI"
    
    smaz_soubory()
    
    server = environ.get("SSH_SERVER")
    port = 22
    user = environ.get("SSH_USERNAME")
    password = environ.get("SSH_PASSWORD")
    local_path = os.path.join(os.getcwd(), "temp_files")
    
    #download TXT
    ssh_client = create_ssh_client(server, port, user, password)
    scp_client = SCPClient(ssh_client.get_transport())
    
    try:
        txt_files = get_txt_files(ssh_client, remote_path)
        download_txt_files(ssh_client, scp_client, txt_files, remote_path, local_path)
    finally:
        scp_client.close()
        ssh_client.close()
        
    #download ZIP
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
