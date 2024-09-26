# iRMC Tools Web UI

This project is a web-based tool that provides a user interface for interacting with iRMC (integrated Remote Management Controller) functionality. The frontend is built with Next.js, and the backend is powered by Flask. The application is designed to manage and monitor systems using the iRMC protocol.

## Features

- Web-based UI to control and monitor systems via iRMC.
- Built with Next.js for the frontend and Flask for the backend.
- User-friendly design and easy navigation.
- Flask API handles the backend logic and communication with iRMC.
- Extensible and easy to integrate into existing infrastructures.

## Prerequisites

To run this project locally, ensure you have the following installed:

- Python 3.6 or higher
- Node.js and npm (for Next.js)
- A working iRMC setup

## Installation

### Backend (Flask)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/iamdaviddang/iRMC-Tools-WebUi-Nextjs-Flask.git
   cd iRMC-Tools-WebUi-Nextjs-Flask/backend
   ```

2. **Set up a virtual environment**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Python dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server**:

   ```bash
   python app.py
   ```

### Frontend (Next.js)

1. **Navigate to the frontend directory**:

   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**:

   ```bash
   npm install
   ```

3. **Run the Next.js development server**:

   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:3000` and the backend Flask server will run on `http://localhost:5050`.

## Usage

Once both the frontend and backend servers are running, navigate to `http://localhost:3000` in your browser to interact with the iRMC interface.

The backend API routes in Flask are used to send commands and requests to iRMC, which can be customized based on the specific functionality you want to implement.

## Example

An example of interacting with the iRMC interface:

1. Open the web UI and input the system information you want to manage.
2. Use the dashboard to monitor system performance or send commands.
3. View real-time feedback from the iRMC in the logs or UI panels.

## Future Enhancements

- Add more advanced monitoring capabilities (e.g., CPU and memory usage graphs).
- Implement additional security measures (authentication, encryption).
- Enhance UI with more interactive elements and real-time data updates.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues for discussions on new features or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
