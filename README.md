## 🔐 Environment Setup (Supabase)

To run this project locally, you need to create a Supabase project and configure your credentials.

---

### 1️⃣ Create an account and organization
Go to: https://supabase.com

Create an organization with any name.

---

### 2️⃣ Create the project
Create a new project using the suggested name:
lite-event-platform

You can use another name, but keeping this helps when following the tutorial.

---

### 3️⃣ Get your Anon Key
Inside your project dashboard, go to:
Settings → API

Copy the key labeled:
anon public

> This is the key used in the frontend.

---

### 4️⃣ Get your Supabase URL
On the same page, copy the:
Project URL


It looks like this:
https://your-project-ref.supabase.co


This will be your `supabaseUrl`.

---

### 5️⃣ Configure environment variables
Update the file:
src/environments/environment.ts

With your credentials:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabaseAnonKey: 'your-anon-key'
}
```