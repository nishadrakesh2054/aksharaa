const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Calendar = require("../Models/CalendarSchema");

const MONGODB_URI = process.env.DataBase || process.env.MONGODB_URI || "mongodb://localhost:27017/aksharaa";

const nepaliCalendar12Months = [
  {
    monthYear: "Baishakh 2083 (Apr - May)",
    events: [
      "1st: Nepalese New Year 2083 Celebration",
      "5th: New Academic Session Orientation",
      "12th: Mother's Day (Aama Ko Mukh Herne Diwas)",
      "22nd: Buddha Jayanti & Ubhauli Parva",
    ],
  },
  {
    monthYear: "Jestha 2083 (May - Jun)",
    events: [
      "1st: International Labour Day Holiday",
      "10th: Inter-House Science & Robotics Exhibition",
      "15th: Republic Day of Nepal (Rastriya Diwas)",
      "22nd: World Environment Day Tree Plantation",
    ],
  },
  {
    monthYear: "Ashadh 2083 (Jun - Jul)",
    events: [
      "7th: International Yoga Day Workshop",
      "15th: National Paddy Day (Dahi Chiura Khane Din)",
      "20th-28th: First Terminal Examinations",
      "29th: Bhanu Jayanti Nepali Literary Competition",
    ],
  },
  {
    monthYear: "Shrawan 2083 (Jul - Aug)",
    events: [
      "1st: Shrawan Sankranti Holiday",
      "10th: Monsoon Vacation Begins",
      "22nd: School Reopens After Monsoon Break",
      "29th: Janai Purnima & Raksha Bandhan",
    ],
  },
  {
    monthYear: "Bhadra 2083 (Aug - Sep)",
    events: [
      "1st: Gai Jatra Celebration",
      "8th: Shree Krishna Janmashtami",
      "15th: Father's Day (Kushe Aushi) Special Assembly",
      "22nd: Haritalika Teej Festival Celebration",
      "29th: Gaura Parva & Children's Day",
    ],
  },
  {
    monthYear: "Ashwin 2083 (Sep - Oct)",
    events: [
      "3rd: Constitution Day of Nepal (Sambidhan Diwas)",
      "8th: Indra Jatra Holiday",
      "15th: Ghatasthapana - Bada Dashain Holidays Begin",
      "24th: Vijaya Dashami Special Assembly",
    ],
  },
  {
    monthYear: "Kartik 2083 (Oct - Nov)",
    events: [
      "5th: School Reopens After Dashain",
      "12th: Tihar / Deepawali Holidays (Laxmi Puja & Bhai Tika)",
      "18th: Chhath Parva Holiday",
      "25th: Parent-Teacher Progress Interaction",
    ],
  },
  {
    monthYear: "Mangsir 2083 (Nov - Dec)",
    events: [
      "5th: Annual Creative Week & Arts Fair 2083",
      "12th: Inter-House Football & Basketball Championship",
      "20th-28th: Second Terminal Examinations",
      "30th: Yomari Punhi & Udhauli Parva",
    ],
  },
  {
    monthYear: "Poush 2083 (Dec - Jan)",
    events: [
      "5th: Aksharaa Model United Nations (Aksharaa MUN)",
      "10th: Christmas Day Celebration",
      "15th: Tamu Lhosar Holiday",
      "20th: Winter Vacation Begins",
    ],
  },
  {
    monthYear: "Magh 2083 (Jan - Feb)",
    events: [
      "1st: Maghe Sankranti Festival",
      "10th: School Reopens After Winter Break",
      "16th: Martyrs' Day Special Assembly",
      "25th: Saraswati Puja / Basanta Panchami",
    ],
  },
  {
    monthYear: "Falgun 2083 (Feb - Mar)",
    events: [
      "7th: National Democracy Day (Prajatantra Diwas)",
      "14th: Maha Shivaratri Holiday",
      "22nd: International Women's Day & Gala",
      "28th: Gyalpo Lhosar Celebration",
    ],
  },
  {
    monthYear: "Chaitra 2083 (Mar - Apr)",
    events: [
      "1st: Fagu Purnima (Holi Festival of Colors)",
      "10th-20th: Annual Final Assessment Examinations",
      "25th: Ghode Jatra Holiday",
      "30th: Academic Session Result & Graduation Day",
    ],
  },
];

async function seedNepali12Months() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // Delete ALL existing calendar records so EXACTLY 12 months exist!
    console.log("Clearing existing calendar records...");
    await Calendar.deleteMany({});
    console.log("Existing calendar entries cleared.");

    // Insert the 12 Nepali months
    console.log("Inserting exactly 12 Nepali months (Baishakh to Chaitra)...");
    await Calendar.insertMany(nepaliCalendar12Months);

    console.log(`✅ Successfully seeded EXACTLY ${nepaliCalendar12Months.length} Nepali Months (Baishakh to Chaitra) into Calendar collection!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Nepali calendar:", error);
    process.exit(1);
  }
}

seedNepali12Months();
