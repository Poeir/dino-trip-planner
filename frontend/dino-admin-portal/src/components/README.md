# Reusable Components Guide

คู่มือการใช้งาน Components ที่สร้างไว้สำหรับ Dino Admin Portal

## การ Import

```jsx
// Import แบบเดี่ยว
import Button from '../components/Button';
import Input from '../components/Input';

// หรือ Import แบบรวม
import { Button, Input, Select, Modal, Badge, Card, Checkbox, Table } from '../components';
```

---

## 1. Button

ปุ่มที่มี variants หลากหลาย

### Props
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `icon`: ReactNode - ไอคอนที่จะแสดง
- `disabled`: boolean
- ...และ props อื่นๆ ของ button

### ตัวอย่างการใช้งาน

```jsx
<Button variant="primary" onClick={handleSubmit}>
  บันทึก
</Button>

<Button variant="secondary" size="sm">
  ยกเลิก
</Button>

<Button variant="danger" icon="🗑️" fullWidth>
  ลบข้อมูล
</Button>
```

---

## 2. Input

Input field พร้อม label และ validation

### Props
- `label`: string - ชื่อ label
- `error`: string - ข้อความ error
- `helperText`: string - ข้อความช่วยเหลือ
- `required`: boolean
- ...และ props อื่นๆ ของ input

### ตัวอย่างการใช้งาน

```jsx
<Input
  label="ชื่อสถานที่"
  required
  placeholder="เช่น วัดพระแก้ว"
  helperText="ใช้สำหรับแสดงในระบบ"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<Input
  label="อีเมล"
  type="email"
  error={emailError}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## 3. Select

Dropdown select พร้อม label

### Props
- `label`: string
- `options`: Array<{value: string, label: string}> - ตัวเลือกใน dropdown
- `error`: string
- `helperText`: string
- `required`: boolean
- ...และ props อื่นๆ ของ select

### ตัวอย่างการใช้งาน

```jsx
<Select
  label="ประเภทสถานที่"
  required
  options={[
    { value: 'tourist_attraction', label: 'สถานที่ท่องเที่ยว' },
    { value: 'restaurant', label: 'ร้านอาหาร' },
    { value: 'hotel', label: 'โรงแรม' }
  ]}
  value={type}
  onChange={(e) => setType(e.target.value)}
/>
```

---

## 4. Modal

Modal dialog พร้อม backdrop

### Props
- `isOpen`: boolean - เปิด/ปิด modal
- `onClose`: function - ฟังก์ชันเมื่อปิด modal
- `title`: string - หัวข้อ modal
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' (default: 'md')
- `showCloseButton`: boolean (default: true)
- `children`: ReactNode - เนื้อหาใน modal

### ตัวอย่างการใช้งาน

```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="เพิ่มสถานที่ใหม่"
  maxWidth="lg"
>
  <form onSubmit={handleSubmit}>
    <Input label="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
    <div className="flex gap-3 mt-6">
      <Button type="submit" fullWidth>บันทึก</Button>
      <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
        ยกเลิก
      </Button>
    </div>
  </form>
</Modal>
```

---

## 5. Badge

Badge สำหรับแสดงสถานะหรือ tag

### Props
- `variant`: 'success' | 'warning' | 'danger' | 'info' | 'emerald' | 'gray' (default: 'emerald')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `rounded`: 'full' | string (default: 'full')
- `children`: ReactNode

### ตัวอย่างการใช้งาน

```jsx
<Badge variant="success">เปิดใช้งาน</Badge>
<Badge variant="warning" size="sm">รอดำเนินการ</Badge>
<Badge variant="danger">ปิดใช้งาน</Badge>
<Badge variant="emerald">+12%</Badge>
```

---

## 6. Card

Card container สำหรับจัดกลุ่มเนื้อหา

### Props
- `title`: string - หัวข้อ card
- `action`: ReactNode - ปุ่มหรือ action ด้านขวาบน
- `padding`: 'none' | 'sm' | 'default' | 'lg' (default: 'default')
- `className`: string
- `children`: ReactNode

### ตัวอย่างการใช้งาน

```jsx
<Card title="สถิติการใช้งาน">
  <p>เนื้อหาภายใน card</p>
</Card>

<Card
  title="การตั้งค่า"
  action={<Button size="sm">แก้ไข</Button>}
  padding="lg"
>
  <div>เนื้อหา</div>
</Card>
```

---

## 7. Checkbox

Checkbox พร้อม label

### Props
- `label`: string
- `checked`: boolean
- `onChange`: function
- `id`: string
- ...และ props อื่นๆ ของ checkbox

### ตัวอย่างการใช้งาน

```jsx
<Checkbox
  label="เปิดใช้งาน"
  checked={isActive}
  onChange={(e) => setIsActive(e.target.checked)}
/>
```

---

## 8. Table

ตาราง data table

### Props
- `columns`: Array<{header: string, field: string, align?: 'left'|'center'|'right', render?: function}>
- `data`: Array<object>
- `onRowClick`: function
- `className`: string

### ตัวอย่างการใช้งาน

```jsx
const columns = [
  { header: 'ชื่อ', field: 'name' },
  { header: 'อีเมล', field: 'email' },
  { 
    header: 'สถานะ', 
    field: 'status',
    align: 'center',
    render: (row) => (
      <Badge variant={row.active ? 'success' : 'danger'}>
        {row.active ? 'เปิด' : 'ปิด'}
      </Badge>
    )
  },
  { header: 'จัดการ', align: 'right', render: (row) => (
    <Button size="sm" onClick={() => handleEdit(row)}>แก้ไข</Button>
  )}
];

const data = [
  { name: 'John Doe', email: 'john@example.com', active: true },
  { name: 'Jane Smith', email: 'jane@example.com', active: false }
];

<Table columns={columns} data={data} onRowClick={handleRowClick} />
```

---

## Color Palette

ใช้สีเหล่านี้เพื่อความสอดคล้อง:

- **Primary (Emerald)**: สีหลักของแอป
  - `bg-emerald-50`, `bg-emerald-500`, `bg-emerald-600`, `bg-emerald-700`
  - `text-emerald-600`, `text-emerald-700`
  
- **Success (Green)**: สำหรับสถานะสำเร็จ
  - `bg-green-100`, `text-green-700`
  
- **Warning (Yellow)**: สำหรับคำเตือน
  - `bg-yellow-100`, `text-yellow-700`
  
- **Danger (Red)**: สำหรับ error หรือการลบ
  - `bg-red-100`, `text-red-700`
  
- **Neutral (Gray)**: สำหรับ secondary elements
  - `bg-gray-100`, `text-gray-700`

---

## Tips

1. ใช้ `Card` component แทนการเขียน `<div className="bg-white rounded-lg shadow-sm p-6">` ซ้ำๆ
2. ใช้ `Button` component เพื่อความสอดคล้องของ UI
3. ใช้ `Badge` สำหรับแสดงสถานะแทน span
4. ใช้ `Table` สำหรับตารางข้อมูลทั้งหมด
5. ใช้ `Modal` แทนการสร้าง modal เอง

## ตัวอย่างการ Refactor

### ก่อน:
```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">หัวข้อ</h3>
  <div>เนื้อหา</div>
</div>
```

### หลัง:
```jsx
<Card title="หัวข้อ">
  <div>เนื้อหา</div>
</Card>
```

---

## การเพิ่ม Component ใหม่

หากต้องการเพิ่ม component ใหม่:

1. สร้างไฟล์ใหม่ใน folder `src/components/`
2. Export component ใน `src/components/index.js`
3. ใช้ naming convention แบบ PascalCase
4. เพิ่มเอกสารในไฟล์นี้

---

**Created:** February 2026  
**Version:** 1.0.0
