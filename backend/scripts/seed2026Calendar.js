const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Event = require("../Models/EventSchema");
const Calendar = require("../Models/CalendarSchema");

const MONGODB_URI = process.env.DataBase || process.env.MONGODB_URI || "mongodb://localhost:27017/aksharaa";


const sampleCalendars2026 = [
  {
    monthYear: "2026-01",
    events: [
      "Jan 01: New Year's Day & First Assembly",
      "Jan 11: National Unity Day (Prithvi Jayanti)",
      "Jan 15: Maghe Sankranti Festival",
      "Jan 22: Annual Sports Week Opening Ceremony",
      "Jan 30: Martyrs' Day Special Assembly",
    ],
  },
  {
    monthYear: "2026-02",
    events: [
      "Feb 05: Mid-Term Examination Starts",
      "Feb 12: Saraswati Puja / Shree Panchami",
      "Feb 16: Maha Shivaratri Holiday",
      "Feb 19: National Democracy Day (Rastriya Prajatantra Diwas)",
      "Feb 25: Parent-Teacher Interaction & Progress Report",
    ],
  },
  {
    monthYear: "2026-03",
    events: [
      "Mar 03: Holi Festival of Colors",
      "Mar 08: International Women's Day Celebration",
      "Mar 15: Final Academic Assessment Starts",
      "Mar 24: Ghode Jatra Holiday",
      "Mar 28: End of Academic Session 2082/2026",
    ],
  },
  {
    monthYear: "2026-04",
    events: [
      "Apr 01: New Academic Session 2083/2026 Begins",
      "Apr 14: Nepalese New Year 2083 Celebration",
      "Apr 17: Orientation Program for New Students",
      "Apr 25: Earth Day Environment Awareness Drive",
      "Apr 30: Inter-House Quiz Competition",
    ],
  },
  {
    monthYear: "2026-05",
    events: [
      "May 01: International Labour Day Holiday",
      "May 12: Buddha Jayanti & Ubhauli Parva",
      "May 18: Science & Technology Exhibition 2026",
      "May 25: Founder's Day & Cultural Performance",
      "May 29: Republic Day of Nepal Holiday",
    ],
  },
  {
    monthYear: "2026-06",
    events: [
      "Jun 05: World Environment Day Tree Plantation",
      "Jun 12: First Terminal Examination Starts",
      "Jun 21: International Yoga Day Workshop",
      "Jun 26: Anti-Drug Awareness Student Rally",
    ],
  },
  {
    monthYear: "2026-07",
    events: [
      "Jul 06: Bhanu Jayanti Nepali Literature Day",
      "Jul 14: Monsoon Break & Mid-Session Vacation Starts",
      "Jul 24: School Reopens After Monsoon Break",
      "Jul 29: Inter-School Debate Championship",
    ],
  },
  {
    monthYear: "2026-08",
    events: [
      "Aug 08: Janai Purnima & Raksha Bandhan",
      "Aug 15: Gai Jatra Celebration",
      "Aug 23: Shree Krishna Janmashtami Holiday",
      "Aug 29: Father's Day (Kushe Aushi) Special Assembly",
    ],
  },
  {
    monthYear: "2026-09",
    events: [
      "Sep 04: Gaura Parva Festival",
      "Sep 14: Haritalika Teej Celebration",
      "Sep 19: Constitution Day of Nepal (Sambidhan Diwas)",
      "Sep 25: Indra Jatra Holiday",
    ],
  },
  {
    monthYear: "2026-10",
    events: [
      "Oct 05: Second Terminal Examination Starts",
      "Oct 16: Bada Dashain Festival Break Begins",
      "Oct 27: School Reopens After Dashain",
      "Oct 30: Tihar & Deepawali Celebration",
    ],
  },
  {
    monthYear: "2026-11",
    events: [
      "Nov 02: Chhath Parva Holiday",
      "Nov 12: Annual Creative Week & Art Fair 2026",
      "Nov 20: Children's Day & Fun Carnival",
      "Nov 28: Inter-House Football & Basketball Finals",
    ],
  },
  {
    monthYear: "2026-12",
    events: [
      "Dec 05: Aksharaa Model United Nations (MUN) 2026",
      "Dec 15: Pre-Board / Final Review Exams",
      "Dec 25: Christmas Day Celebration",
      "Dec 30: Annual Cultural Gala & Prize Distribution",
    ],
  },
];

const sampleEvents2026 = [
  {
    title: "Annual Sports Meet & Athletic Championship 2026",
    date: "2026-01-22",
    description: "Annual inter-house sports meet featuring track & field events, basketball, football, and martial arts demonstrations.",
  },
  {
    title: "Saraswati Puja & Basanta Panchami Celebration",
    date: "2026-02-12",
    description: "Worship of Goddess Saraswati, Aksharambha ceremony for kindergarten children, and traditional music performances.",
  },
  {
    title: "Nepalese New Year 2083 Welcome & Cultural Program",
    date: "2026-04-14",
    description: "Grand celebration welcoming Bikram Sambat 2083 with traditional music, folk dances, and food stalls.",
  },
  {
    title: "Science, Robotics & STEM Expo 2026",
    date: "2026-05-18",
    description: "Interactive exhibition showcasing student-built robotics, AI prototypes, science experiments, and innovative models.",
  },
  {
    title: "Aksharaa Annual Cultural Gala & Grand Musical 2026",
    date: "2026-05-25",
    description: "Annual cultural festival with drama performances, orchestra, choir, and student awards distribution.",
  },
  {
    title: "World Environment Day & Campus Greenery Drive",
    date: "2026-06-05",
    description: "Tree plantation drive, eco-friendly project displays, and environmental awareness presentations.",
  },
  {
    title: "Bhanu Jayanti Literary & Poetry Recitation",
    date: "2026-07-06",
    description: "Literary competition celebrating Adikavi Bhanubhakta Acharya with poem recitations and Nepali essay contests.",
  },
  {
    title: "Annual Creative Week & Visual Arts Exhibition",
    date: "2026-11-12",
    description: "A week-long celebration of fine arts, photography, pottery, music, and creative design.",
  },
  {
    title: "Aksharaa Model United Nations (Aksharaa MUN 2026)",
    date: "2026-12-05",
    description: "Flagship youth diplomacy conference bringing together student delegates from across the valley.",
  },
  {
    title: "Grand Annual Prize Distribution & Farewell Gala",
    date: "2026-12-30",
    description: "Recognizing academic achievers, athletic champions, and best house of the year 2026.",
  },
];

async function seedData() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // Seed Calendar schedules
    console.log("Seeding 2026 Monthly Calendar Schedules...");
    for (const calData of sampleCalendars2026) {
      await Calendar.updateOne(
        { monthYear: calData.monthYear },
        { $set: calData },
        { upsert: true }
      );
    }
    console.log(`Seeded ${sampleCalendars2026.length} months into Calendar collection.`);

    // Seed Events
    console.log("Seeding 2026 Major Upcoming Events...");
    for (const evtData of sampleEvents2026) {
      await Event.updateOne(
        { title: evtData.title },
        { $set: evtData },
        { upsert: true }
      );
    }
    console.log(`Seeded ${sampleEvents2026.length} major events into Event collection.`);

    console.log("\n✅ 2026 Events and Calendar Schedule Data Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding 2026 events/calendar data:", error);
    process.exit(1);
  }
}

seedData();
