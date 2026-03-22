export const mockTripPlan = {
  title: "ทริปขอนแก่น 2 วัน 1 คืน",
  startDate: "1 พฤษภาคม 2568",
  endDate: "2 พฤษภาคม 2568",
  totalPlaces: 6,
  totalDistance: 45,
  days: [
    {
      date: "1 พฤษภาคม 2568",
      slots: [
        {
          time: "08:00",
          places: [{ id: 1, name: "วัดหนองแวง", type: "วัด" }],
        },
        {
          time: "08:30",
          places: [
            { id: 2, name: "ที่พัก A", type: "ที่พัก" },
            { id: 3, name: "คาเฟ่ริมบึง", type: "คาเฟ่" },
            { id: 4, name: "พิพิธภัณฑ์", type: "แหล่งเรียนรู้" },
            { id: 5, name: "ตลาดโต้รุ่ง", type: "ตลาด" },
          ],
        },
      ],
    },
    {
      date: "2 พฤษภาคม 2568",
      slots: [
        {
          time: "",
          places: [
            { id: 6, name: "บึงแก่นนคร", type: "ธรรมชาติ" },
            { id: 7, name: "ที่พัก B", type: "ที่พัก" },
          ],
        },
      ],
    },
  ],
};
