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
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Reboot/PowerON", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "Reboot/PowerON", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
        
    
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
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Power Off", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "Power Off", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
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
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Clear SEL", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "Clear SEL", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
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
        return jsonify({"message":"ERROR: Missing required data", "status":"bad"})
    
    userInput = user_data['userData']
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Get Info", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
    try:
        power_status, password, model = check_power_status(irmc_ip)
        task = get_system_fw_info(irmc_ip, "admin", password)
        
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
                }
        }, "status":"ok"})
    except:
        addNewTask(userInput, "Get Info", "bad")
        return jsonify({"message":"ERROR! Please check it manually.", "status":"bad"})

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
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "SD Card Check", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "SD Card Check", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
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
    
    if userInput.startswith(("EWCF", "EWAB", "EWAA")):
        addNewTask(userInput, "Show SEL", "bad")
        return jsonify({"message":"ERROR: Sorry but this model is not supported. Please insert iRMC IP instead.", "status":"bad"})
    
    irmc_ip = ""
    if userInput.startswith("172.25."):
        irmc_ip = userInput
        
    elif userInput.startswith("EW"):
        if len(userInput) != 10:
            addNewTask(userInput, "Show SEL", "bad")
            return jsonify({"message":"USN length is not correct! Please check it.", "status":"bad"})
        irmc_ip = get_irmc_ip(userInput)["ip"]
    else:
        addNewTask(userInput, "Show SEL", "bad")
        return jsonify({"message":"ERROR: Unknown input.", "status":"bad"})
    
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
    
    