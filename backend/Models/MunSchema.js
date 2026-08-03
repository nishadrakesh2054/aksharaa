const mongoose = require("mongoose");

const munSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "AKSHARAA MODEL UNITED NATIONS",
    },
    subtitle: {
      type: String,
      default: "AMUN",
    },
    aboutTitle: {
      type: String,
      default: "About MUN",
    },
    aboutText: {
      type: String,
      default:
        "Model United Nations (MUN) is an educational activity that stimulates the proceedings of the United Nations, allowing participants to step into the roles of diplomats and representatives of various countries.",
    },
    whyTitle: {
      type: String,
      default: "WHY AMUN?",
    },
    whyText: {
      type: String,
      default:
        "The Aksharaa Model United Nations is an esteemed annual event organized by Aksharaa School, providing a dynamic platform for young minds to engage in meaningful discussions on global issues, diplomacy, and conflict resolution.",
    },
    goalsTitle: {
      type: String,
      default: "OUR GOALS",
    },
    goalsList: {
      type: [String],
      default: [
        "MUN helps to ensure a clear concept on diverse topics, diplomacy, & engaging committee sessions to provide an educational experience to delegates.",
        "Delegates improve their public speaking skills, overcome their massphobia and increase their confidence while speaking and making conversations.",
        "The goal is to enhance research, presentation & facilitation skills and help to explore creative solutions to complex challenges to delegates.",
      ],
    },
    sliderImages: {
      type: [String],
      default: [],
    },
    gridImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mun", munSchema);
