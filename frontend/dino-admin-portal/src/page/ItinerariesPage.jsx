
// Mock data สำหรับ Itineraries (โปรแกรมการเดินทาง)
const MOCK_ITINERARIES = [
  {
    id: 1,
    title: 'ทริปสุดสัปดาห์ขอนแก่น 2 วัน 1 คืน',
    theme: 'วัฒนธรรมและธรรมชาติ',
    days: 2,
    generatedBy: 'LLM',
    isPublic: true,
    stops: [
      { day: 1, time: '09:00', placeName: 'หนองแวง', activity: 'ถ่ายรูป ชมทิวทัศน์ยามเช้า' },
      { day: 1, time: '12:00', placeName: 'ร้านอาหารเมืองขอนแก่น', activity: 'ทานอาหารกลางวัน' },
      { day: 1, time: '14:00', placeName: 'พิพิธภัณฑ์ท้องถิ่นขอนแก่น', activity: 'ชมนิทรรศการ เรียนรู้ประวัติศาสตร์' },
      { day: 2, time: '08:00', placeName: 'ตลาดต้นตาล', activity: 'ช้อปปิ้งของฝาก' }
    ]
  },
  {
    id: 2,
    title: 'ทริปเที่ยวครอบครัว 3 วัน 2 คืน',
    theme: 'สนุกสนาน/ท่องเที่ยว',
    days: 3,
    generatedBy: 'User',
    isPublic: false,
    stops: [
      { day: 1, time: '10:00', placeName: 'ศูนย์การค้าเซ็นทรัลพลาซ่า', activity: 'ช้อปปิ้ง พักผ่อน' },
      { day: 2, time: '09:00', placeName: 'สวนสาธารณะบึงแก่นนคร', activity: 'ปั่นจักรยาน วิ่งออกกำลังกาย' },
      { day: 3, time: '08:00', placeName: 'ตลาดบ้านโคก', activity: 'ชิมอาหารพื้นถิ่น' }
    ]
  },
  {
    id: 3,
    title: 'One Day Trip ขอนแก่น',
    theme: 'ท่องเที่ยวแบบเร็ว',
    days: 1,
    generatedBy: 'LLM',
    isPublic: true,
    stops: [
      { day: 1, time: '08:00', placeName: 'หนองแวง', activity: 'เช็คอิน ชมทะเลสาบ' },
      { day: 1, time: '12:00', placeName: 'ร้านอาหารเก่งเจ๊ก', activity: 'ทานอาหารกลางวัน' },
      { day: 1, time: '15:00', placeName: 'พิพิธภัณฑ์ไดโนเสาร์', activity: 'ชมโครงกระดูกไดโนเสาร์' }
    ]
  }
];

function ItinerariesPage() {
  return (
    <>
      <h1>Itineraries</h1>
    </>
  )
}

export default ItinerariesPage;
