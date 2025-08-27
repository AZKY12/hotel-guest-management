# 🏨 Guest Management System

A simplified **Guest Management Module** for a hotel management system.
This project allows hotel staff to manage guest information including **adding, editing, deleting, and viewing guest details** (basic CRUD operations).

This was built as a **Full-Stack Development Intern Mini Project** using **React + TypeScript (Vite)** on the frontend and **Pocketbase** as the backend.

---

## 📂 Project Structure

```
/hotel-guest-management
  ├── /server        # Pocketbase backend files
  ├── /client        # React frontend files
  ├── README.md      # Setup & run instructions
```

---

## ⚙️ Tech Stack

### Frontend

* [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vite.dev/) – build tool
* [Tailwind CSS](https://tailwindcss.com/) – styling

### Backend

* [Pocketbase](https://pocketbase.io/) – backend

### Tools

* Git for version control

---

## 📑 Features

✅ Guest list view (fetch all guests)
✅ Add new guest
✅ Edit/update guest details
✅ Delete guest
✅ View guest details by ID
✅ Search & filter guests
✅ Integration with Pocketbase backend

---

## 🗄️ Database Schema (Pocketbase)

Collection: `guests`

| Field           | Type   | Required | Unique | Description              |
| --------------- | ------ | -------- | ------ | ------------------------ |
| `id`            | auto   | Yes      | Yes    | Auto-generated ID        |
| `first_name`    | string | Yes      | No     | Guest’s first name       |
| `last_name`     | string | Yes      | No     | Guest’s last name        |
| `email`         | string | Yes      | Yes    | Guest’s email            |
| `phone`         | string | No       | No     | Phone number             |
| `address`       | string | No       | No     | Address                  |
| `date_of_birth` | date   | No       | No     | Date of birth            |
| `created`       | date   | Yes      | Yes    | Auto-generated timestamp |

🔹 CRUD permissions are configured.
🔹 3 sample guest records are added in Pocketbase Admin UI.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone Repository

```bash
git clone https://github.com/AZKY12/hotel-guest-management.git
cd hotel-guest-management
```

---

### 2. Backend Setup (Pocketbase)

1. Download Pocketbase:

   * [Pocketbase Releases](https://pocketbase.io/docs/)

2. Move the binary into the `/server` folder:

   ```
   /server/pocketbase
   ```

3. Start Pocketbase server:

   ```bash
   cd server
   ./pocketbase serve
   ```

   By default, Pocketbase runs on **[http://127.0.0.1:8090](http://127.0.0.1:8090)**

4. Access Admin UI:

   * URL: `http://127.0.0.1:8090/_/`
   * Login with the following credentials:

     ```
     Email: admin@example.com
     Password: Admin1234567!
     ```

5. Ensure that the `guests` collection is created with fields mentioned above.

---

### 3. Frontend Setup (React + Vite + TypeScript)

```bash
cd client
npm install
npm run dev
```

Frontend will start on **[http://127.0.0.1:5173](http://127.0.0.1:5173)**

---

### 4. Integration

The frontend is integrated with Pocketbase using its JavaScript SDK.

Update the Pocketbase API URL if needed:

```ts
// client/src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Change if hosted elsewhere

export default pb;
```

---

## 📸 UI Pages

* `/guests` → Guest list page
  <img width="1438" height="727" alt="image" src="https://github.com/user-attachments/assets/e25a0475-252b-4e8a-8f85-6d39f15d8dba" />
* `/guests/new` → Add new guest
  <img width="1438" height="727" alt="image" src="https://github.com/user-attachments/assets/bb565d73-d3c3-45c1-b10b-1ca589b62069" />
* `/guests/:id` → Guest detail/edit page
  <img width="1437" height="726" alt="image" src="https://github.com/user-attachments/assets/57102177-91f1-4a2b-82cb-109a33059b68" />

---

## 📜 License

This project is built for **educational purposes** as part of a **Full-Stack Development Intern Mini Project**.


