const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const { faqModel: Faq } = require("../Models/FaqSchema");

const sampleFaqs = [
  {
    question: "What grades does Aksharaa School currently offer?",
    answer:
      "Aksharaa School offers learning programs from Playgroup through Grade 10, with a child-centric approach designed for each developmental stage.",
    category: "general",
    order: 1,
  },
  {
    question: "Where is Aksharaa School located?",
    answer:
      "Aksharaa School is located in Kathmandu, Nepal. Families can contact the admissions team to schedule a guided campus visit.",
    category: "general",
    order: 2,
  },
  {
    question: "How can parents apply for admission?",
    answer:
      "Parents can apply online through the school website or visit the school in person. After the application is reviewed, the admissions team shares the next steps for assessment and interaction.",
    category: "admission",
    order: 1,
  },
  {
    question: "What documents are required during admission?",
    answer:
      "Commonly required documents include previous school records, birth certificate, passport-size photos, transfer certificate when applicable, and parent or guardian identification documents.",
    category: "admission",
    order: 2,
  },
  {
    question: "Does the school conduct an entrance assessment?",
    answer:
      "Yes. Prospective students may participate in written and oral assessments, while parents interact with the admissions team to understand the school approach.",
    category: "admission",
    order: 3,
  },
  {
    question: "What is the LRPA framework?",
    answer:
      "LRPA stands for Learning, Reinforcement, Practice, and Application. It helps students build understanding through structured learning and meaningful application.",
    category: "academics",
    order: 1,
  },
  {
    question: "How does Aksharaa support holistic learning?",
    answer:
      "The school combines academics, co-curricular activities, socio-emotional development, inquiry, collaboration, and values-based learning.",
    category: "academics",
    order: 2,
  },
  {
    question: "What facilities are available on campus?",
    answer:
      "Aksharaa School provides modern classrooms, activity spaces, library access, science and computer learning resources, transportation support, and student-friendly campus facilities.",
    category: "facilities",
    order: 1,
  },
  {
    question: "Is transportation available?",
    answer:
      "Yes. School transportation support is available on selected routes. Parents can confirm route details with the administration team.",
    category: "facilities",
    order: 2,
  },
];

const seedFaqs = async () => {
  if (!process.env.DataBase) {
    throw new Error("DataBase environment variable is missing.");
  }

  await mongoose.connect(process.env.DataBase, {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 45000,
  });

  const operations = sampleFaqs.map((faq) => ({
    updateOne: {
      filter: { question: faq.question },
      update: { $setOnInsert: { ...faq, isActive: true } },
      upsert: true,
    },
  }));

  const result = await Faq.bulkWrite(operations);
  console.log(`FAQ seed complete. Inserted: ${result.upsertedCount}, existing skipped: ${sampleFaqs.length - result.upsertedCount}`);
};

seedFaqs()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
