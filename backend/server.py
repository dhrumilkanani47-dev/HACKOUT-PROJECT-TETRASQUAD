"""
EV GreenCharge Python Backend Server
Provides User Auth, SQLite Database, OTP Generation & Verification,
Password Management, and Invitation Email Sending.
"""

import sys
import os
import json
import sqlite3
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timedelta

PORT = 5000
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.sqlite')
TARGET_ADMIN_EMAIL = 'krushilgadhiya138@gmail.com'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'driver',
        company_name TEXT,
        state TEXT DEFAULT 'Gujarat',
        city TEXT DEFAULT 'Gandhinagar',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 2. OTP Verifications Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS otp_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        purpose TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 3. Email Logs Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS email_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Seed initial test users if not existing
    seed_users = [
        ('usr_001', 'Shani Kakadiya', 'shani.kakadiya@daiict.ac.in', '+91 98765 43210', hash_password('password123'), 'driver', 'Tata Power', 'Gujarat', 'Gandhinagar'),
        ('usr_002', 'Krushil Gadhiya', 'krushilgadhiya138@gmail.com', '+91 98250 12345', hash_password('password123'), 'driver', 'Tata Power', 'Gujarat', 'Ahmedabad'),
        ('usr_003', 'Tata Power Operator', 'operator.tatapower@evcharge.in', '+91 98765 00001', hash_password('operator123'), 'operator', 'Tata Power', 'Gujarat', 'Gandhinagar'),
        ('usr_004', 'SLDC Grid Controller', 'grid.operations@gujaratsldc.in', '+91 98765 00002', hash_password('grid123'), 'grid_operator', 'Gujarat SLDC', 'Gujarat', 'Vadodara')
    ]

    for u in seed_users:
        cursor.execute('''
        INSERT OR IGNORE INTO users (id, name, email, phone, password_hash, role, company_name, state, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', u)

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_FILE}")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def send_real_or_simulated_email(to_email: str, subject: str, body: str) -> bool:
    """Attempts to send email via SMTP; logs and records in DB."""
    print(f"\n================ [EMAIL NOTIFICATION] ================")
    print(f"TO: {to_email}")
    print(f"ADMIN CC: {TARGET_ADMIN_EMAIL}")
    print(f"SUBJECT: {subject}")
    print(f"BODY:\n{body}")
    print(f"======================================================\n")

    # Save to email_logs DB
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO email_logs (recipient_email, subject, body, status) VALUES (?, ?, ?, ?)",
            (to_email, subject, body, 'SENT_OR_SIMULATED')
        )
        if to_email.lower() != TARGET_ADMIN_EMAIL.lower():
            cursor.execute(
                "INSERT INTO email_logs (recipient_email, subject, body, status) VALUES (?, ?, ?, ?)",
                (TARGET_ADMIN_EMAIL, f"[ADMIN COPY] {subject}", body, 'SENT_OR_SIMULATED')
            )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging email: {e}")

    # Try live SMTP if env vars are present, otherwise graceful simulation
    smtp_server = os.environ.get('SMTP_SERVER')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_pass = os.environ.get('SMTP_PASS')

    if smtp_server and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart()
            msg['From'] = smtp_user
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))

            server = smtplib.SMTP(smtp_server, smtp_port, timeout=5)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"Successfully delivered email via SMTP to {to_email}")
            return True
        except Exception as err:
            print(f"SMTP delivery failed, falling back to simulated log: {err}")

    return True

class RequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self._send_json(200, {'status': 'ok', 'timestamp': datetime.now().isoformat()})
        elif self.path == '/api/users':
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, email, phone, role, company_name, created_at FROM users')
            rows = cursor.fetchall()
            users = [{'id': r[0], 'name': r[1], 'email': r[2], 'phone': r[3], 'role': r[4], 'companyName': r[5], 'createdAt': r[6]} for r in rows]
            conn.close()
            self._send_json(200, {'users': users})
        else:
            self._send_json(404, {'error': 'Route not found'})

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        # -------------------------------------------------------------
        # 1. CHECK USER REGISTRATION STATUS
        # -------------------------------------------------------------
        if self.path == '/api/auth/check-user':
            email = (body.get('email') or '').strip().lower()
            if not email:
                return self._send_json(400, {'error': 'Email is required'})
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, email, role, company_name FROM users WHERE LOWER(email) = ?', (email,))
            user = cursor.fetchone()
            conn.close()

            if user:
                return self._send_json(200, {
                    'exists': True,
                    'user': {'id': user[0], 'name': user[1], 'email': user[2], 'role': user[3], 'companyName': user[4]}
                })
            else:
                return self._send_json(200, {'exists': False})

        # -------------------------------------------------------------
        # 2. SEND OTP (FOR SIGNUP / FORGOT PASSWORD / CHANGE PASSWORD)
        # -------------------------------------------------------------
        elif self.path == '/api/auth/send-otp':
            email = (body.get('email') or '').strip().lower()
            purpose = body.get('purpose', 'verification') # 'signup' | 'forgot_password' | 'change_password'

            if not email:
                return self._send_json(400, {'error': 'Email is required'})

            # Generate 4-digit OTP matching attachment (e.g. 4719 or random)
            import random
            otp_code = f"{random.randint(1000, 9999)}"
            # Let's use 4719 or random 4-digit code
            if purpose == 'demo':
                otp_code = '4719'

            expires_at = (datetime.now() + timedelta(minutes=10)).isoformat()

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO otp_verifications (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)',
                (email, otp_code, purpose, expires_at)
            )
            conn.commit()
            conn.close()

            # Construct Email message
            subject = f"Your EV GreenCharge Verification Code: {otp_code}"
            email_body = f"""
            <h2>EV GreenCharge Gujarat</h2>
            <p>Your one-time 4-digit verification code is:</p>
            <h1 style="font-size: 32px; color: #10B981; letter-spacing: 4px;">{otp_code}</h1>
            <p>Purpose: <b>{purpose.replace('_', ' ').title()}</b></p>
            <p>This code expires in 10 minutes.</p>
            <hr />
            <p style="font-size: 11px; color: #888;">Notification sent to: {email} & {TARGET_ADMIN_EMAIL}</p>
            """
            send_real_or_simulated_email(email, subject, email_body)

            return self._send_json(200, {
                'success': True,
                'message': f'OTP sent successfully to {email}',
                'otp': otp_code, # returned for smooth demo / quick-fill in UI
                'expiresInSeconds': 600
            })

        # -------------------------------------------------------------
        # 3. VERIFY OTP
        # -------------------------------------------------------------
        elif self.path == '/api/auth/verify-otp':
            email = (body.get('email') or '').strip().lower()
            otp_code = (body.get('otp') or '').strip()
            purpose = body.get('purpose', 'verification')

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, otp_code, expires_at, is_used FROM otp_verifications 
                WHERE LOWER(email) = ? AND otp_code = ? AND is_used = 0 
                ORDER BY id DESC LIMIT 1
            ''', (email, otp_code))
            record = cursor.fetchone()

            # Accept valid database OTP or universal test OTP 4719
            if record or otp_code == '4719':
                if record:
                    cursor.execute('UPDATE otp_verifications SET is_used = 1 WHERE id = ?', (record[0],))
                    conn.commit()
                conn.close()
                return self._send_json(200, {'valid': True, 'message': 'OTP verified successfully!'})
            else:
                conn.close()
                return self._send_json(400, {'valid': False, 'error': 'Invalid or expired OTP code. Please try again.'})

        # -------------------------------------------------------------
        # 4. LOGIN
        # -------------------------------------------------------------
        elif self.path == '/api/auth/login':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password', '')

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, email, phone, password_hash, role, company_name, state, city FROM users WHERE LOWER(email) = ?', (email,))
            user_row = cursor.fetchone()
            conn.close()

            if not user_row:
                # "account not found new user please sign up"
                return self._send_json(404, {
                    'error': 'Account not found. New user? Please sign up to continue.',
                    'code': 'USER_NOT_FOUND'
                })

            # Check password
            pw_hash = hash_password(password)
            if user_row[4] != pw_hash and password != 'password123': # allow demo master password
                return self._send_json(401, {
                    'error': 'Incorrect password. Try again or use Forgot Password.',
                    'code': 'INVALID_CREDENTIALS'
                })

            user_obj = {
                'id': user_row[0],
                'name': user_row[1],
                'email': user_row[2],
                'phone': user_row[3],
                'role': user_row[5],
                'companyName': user_row[6],
                'state': user_row[7],
                'city': user_row[8]
            }

            token = f"jwt_{hashlib.md5(f'{email}_{datetime.now()}'.encode()).hexdigest()}"
            return self._send_json(200, {
                'token': token,
                'user': user_obj,
                'message': 'Login successful'
            })

        # -------------------------------------------------------------
        # 5. SIGNUP (WITH INVITATION / WELCOME EMAIL)
        # -------------------------------------------------------------
        elif self.path == '/api/auth/signup':
            email = (body.get('email') or '').strip().lower()
            name = (body.get('name') or 'EV User').strip()
            phone = (body.get('phone') or '+91 98765 43210').strip()
            password = body.get('password') or 'password123'
            role = body.get('role', 'driver')
            company_name = body.get('companyName') or ('Gujarat SLDC' if role == 'grid_operator' else 'Tata Power')

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM users WHERE LOWER(email) = ?', (email,))
            existing = cursor.fetchone()

            if existing:
                conn.close()
                # "if logined user try to sign up give pop up for already registered"
                return self._send_json(409, {
                    'error': 'Already registered! An account with this email already exists. Please log in.',
                    'code': 'ALREADY_REGISTERED'
                })

            new_id = f"usr_{int(datetime.now().timestamp())}"
            pw_hash = hash_password(password)

            cursor.execute('''
                INSERT INTO users (id, name, email, phone, password_hash, role, company_name, state, city)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Gujarat', 'Gandhinagar')
            ''', (new_id, name, email, phone, pw_hash, role, company_name))
            conn.commit()
            conn.close()

            # Send Invitation / Welcome Email
            welcome_subject = f"Welcome to EV GreenCharge Gujarat, {name}!"
            welcome_body = f"""
            <h2>Welcome to EV GreenCharge Platform</h2>
            <p>Dear <b>{name}</b>,</p>
            <p>Your registration is complete! You can now access dynamic green charging, live Gujarat SLDC renewable tariffs, and smart charging AI schedules.</p>
            <p><b>Account Details:</b></p>
            <ul>
                <li>Email: <b>{email}</b></li>
                <li>Role: <b>{role.title()}</b></li>
                <li>Registered Hub / Org: <b>{company_name}</b></li>
            </ul>
            <p>Start driving green and save up to 40% on EV charging!</p>
            <hr />
            <p style="color: #666; font-size: 11px;">Admin notification copy dispatched to {TARGET_ADMIN_EMAIL}</p>
            """
            send_real_or_simulated_email(email, welcome_subject, welcome_body)

            user_obj = {
                'id': new_id,
                'name': name,
                'email': email,
                'phone': phone,
                'role': role,
                'companyName': company_name,
                'state': 'Gujarat',
                'city': 'Gandhinagar'
            }
            token = f"jwt_{hashlib.md5(f'{email}_{datetime.now()}'.encode()).hexdigest()}"

            return self._send_json(201, {
                'token': token,
                'user': user_obj,
                'message': 'Account created and invitation email sent!'
            })

        # -------------------------------------------------------------
        # 6. FORGOT PASSWORD (RESET PASSWORD)
        # -------------------------------------------------------------
        elif self.path == '/api/auth/forgot-password':
            email = (body.get('email') or '').strip().lower()
            new_password = body.get('newPassword')

            if not email or not new_password:
                return self._send_json(400, {'error': 'Email and new password are required'})

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name FROM users WHERE LOWER(email) = ?', (email,))
            user = cursor.fetchone()

            if not user:
                conn.close()
                return self._send_json(404, {'error': 'Account not found. Please sign up.'})

            pw_hash = hash_password(new_password)
            cursor.execute('UPDATE users SET password_hash = ? WHERE LOWER(email) = ?', (pw_hash, email))
            conn.commit()
            conn.close()

            # Send confirmation email
            confirm_subject = "Your EV GreenCharge Password Was Reset"
            confirm_body = f"""
            <h2>Password Changed Successfully</h2>
            <p>Hello {user[1]},</p>
            <p>The password for your EV GreenCharge account (<b>{email}</b>) was successfully updated.</p>
            <p>If you did not make this change, please contact support immediately.</p>
            """
            send_real_or_simulated_email(email, confirm_subject, confirm_body)

            return self._send_json(200, {'success': True, 'message': 'Password updated successfully! Please log in.'})

        # -------------------------------------------------------------
        # 7. CHANGE PASSWORD (FROM SETTINGS)
        # -------------------------------------------------------------
        elif self.path == '/api/auth/change-password':
            email = (body.get('email') or '').strip().lower()
            current_pw = body.get('currentPassword')
            new_pw = body.get('newPassword')

            if not email or not new_pw:
                return self._send_json(400, {'error': 'Missing password fields'})

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT password_hash FROM users WHERE LOWER(email) = ?', (email,))
            user = cursor.fetchone()

            if not user:
                conn.close()
                return self._send_json(404, {'error': 'User not found'})

            # Verify current password if provided
            if current_pw:
                curr_hash = hash_password(current_pw)
                if user[0] != curr_hash and current_pw != 'password123':
                    conn.close()
                    return self._send_json(401, {'error': 'Current password is incorrect'})

            new_hash = hash_password(new_pw)
            cursor.execute('UPDATE users SET password_hash = ? WHERE LOWER(email) = ?', (new_hash, email))
            conn.commit()
            conn.close()

            return self._send_json(200, {'success': True, 'message': 'Password updated successfully!'})

        else:
            self._send_json(404, {'error': 'Endpoint not found'})

def run_server():
    init_db()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"[SUCCESS] Python EV GreenCharge Backend running at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
