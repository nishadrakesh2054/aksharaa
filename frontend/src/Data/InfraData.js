import  comLab1 from '../../src/assets/infrastructure/compLab/GP4A8082.jpg'
import  comLab3 from '../../src/assets/infrastructure/compLab/GP4A8074.jpg'
import  comLab4 from '../../src/assets/infrastructure/compLab/GP4A8088.jpg'

import cafeteria1 from '../../src/assets/infrastructure/cafeteria/GP4A7728.jpg';
import cafeteria2 from '../../src/assets/infrastructure/cafeteria/GP4A7745.jpg';
import cafeteria3 from '../../src/assets/infrastructure/cafeteria/GP4A7749.jpg';

import library1 from '../../src/assets/infrastructure/library/GP4A8168.jpg';
import library2 from '../../src/assets/infrastructure/library/GP4A8177.jpg';
import library3 from '../../src/assets/infrastructure/library/GP4A8161.jpg';


import transportation1 from '../../src/assets/infrastructure/trasportaion/GP4A7770.jpg';
import transportation2 from '../../src/assets/infrastructure/trasportaion/GP4A7775.jpg';
import transportation3 from '../../src/assets/infrastructure/trasportaion/GP4A7777.jpg';

import sciencelab1 from '../../src/assets/infrastructure/scienceLab/GP4A8256.jpg';
import sciencelab2 from '../../src/assets/infrastructure/scienceLab/GP4A8267.jpg';
import sciencelab3 from '../../src/assets/infrastructure/scienceLab/GP4A8273.jpg';


import playarea1 from '../../src/assets/infrastructure/playarea/GP4A8192.jpg';
import playarea2 from '../../src/assets/infrastructure/playarea/GP4A8238.jpg';
import playarea3 from '../../src/assets/infrastructure/playarea/GP4A8243.jpg';



import infirmary1 from '../../src/assets/infrastructure/infirmary/GP4A8031.jpg';
import infirmary2 from '../../src/assets/infrastructure/infirmary/GP4A8053.jpg';
import infirmary3 from '../../src/assets/infrastructure/infirmary/GP4A8130.jpg';




import outdoor1 from '../../src/assets/infrastructure/outdoor/GP4A7705.jpg';
import outdoor2 from '../../src/assets/infrastructure/outdoor/GP4A8183.jpg';
import outdoor3 from '../../src/assets/infrastructure/outdoor/GP4A8190.jpg';


const infrastructureData = [
  {
    id: 1,
    title: "Computer Laboratory",
    iconClass: "fas fa-desktop text-primary",
    description: `Our Computer Laboratory is a cornerstone of our commitment to digital literacy and innovation. Equipped with 60 advanced computers, the lab features the latest hardware and software, all supported by high-speed internet connectivity. This facility is more than just a space for students to complete assignments; it is a hub for digital exploration and learning. Students and teachers have unrestricted access to the lab, encouraging them to delve into research, engage in coding projects, and explore multimedia tools. To ensure a safe online environment, we adhere to a strict code of conduct for internet use, fostering responsible digital citizenship.`,
    images: [comLab3,comLab4, comLab1],
  },

  {
    id: 7,
    title: "Science Laboratory",
    iconClass: "fas fa-flask text-success",
    description: `The Science Laboratory at Aksharaa School is equipped with the latest scientific instruments and materials, creating an ideal environment for hands-on learning and experimentation. Our spacious lab is designed to enhance the understanding of scientific concepts through practical, interactive experiments. Students regularly engage in experiments that complement their classroom learning, supported by our kitchen garden, school garden, and field visits. This practical approach helps students to link theoretical knowledge with real-world applications, promoting a more profound comprehension of scientific principles and nurturing  a lifelong curiosity about the natural world.`,
    images: [
      sciencelab3,
      sciencelab1,
      sciencelab2,
     
    ],
  },


  {
    id: 2,
    title: "Cafeteria",
    iconClass: "fas fa-utensils text-success",
    description: `The Cafeteria at Aksharaa School is designed to be a vibrant and welcoming space where students can enjoy nutritious and delicious meals. Our cafeteria offers a variety of vegetarian dishes, prepared daily by skilled chefs under strict hygiene standards. With a focus on health and wellness, our meals are crafted to meet the dietary needs of growing children while also providing a comfortable and social dining experience. The spacious cafeteria comfortably accommodates all students and staff, promoting a sense of community and relaxation during meal times.`,
    images: [
      cafeteria1,
      cafeteria2,
      cafeteria3,
    ],
  },

  
  {
    id: 3,
    title: "Library",
    iconClass: "fas fa-book text-warning",
    description: `Our library presents a wide collection of books that functions as a vital reservoir of intellectual resources, designed to inspire a profound love for reading and foster independent learning. With a rich range of diverse reading materials—including storybooks from a variety of authors, scholarly journals, and encyclopedias—our library effectively addresses the varied interests and academic needs of our diverse readership. It serves as a nurturing environment where students can explore their curiosities, cultivate their passions, and ultimately identify their pathways toward lifelong learning. Through this enriching atmosphere, we aim to instill a deep appreciation for knowledge and the joy of discovery`,
    images: [library2,library3,library1 ],
  },
  {
    id: 4,
    title: "Play Area",
    iconClass: "fas fa-futbol text-info",
    description: `Our Play areas are designed to support the physical development and well-being of our students through engaging and dynamic recreational activities. These facilities are more than just spaces for play; they are integral to our holistic approach to education, combining academic learning with physical activity. Our play area features a range of equipment and sports facilities that encourage students to participate in various sports and games. This integration of physical fitness with educational experiences promotes a balanced lifestyle, fostering teamwork, resilience, and overall health in our students`,
    images: [playarea2,playarea1,  playarea3],
  },
  // {
  //   id: 5,
  //   title: "Visitors’ Lounge ",
  //   iconClass: "fas fa-users text-danger",
  //   description: `The visitors’ lounge provides a comfortable and inviting space for parents and visitors to engage with the school community. Equipped with modern amenities, it offers a venue for meetings, school events, and informal gatherings, fostering a collaborative relationship between the school and the other stakeholder.`,
  //   images: [visitoelounge1, visitoelounge2, visitoelounge3],
  // },


  {
    id: 6,
    title: "Transportation",
    iconClass: "fas fa-bus text-primary",
    description: `Strategically located 3.5 km from Koteshwor’s ring road, Aksharaa School offers efficient and secure transportation options for students. Our fleet of modern school buses ensures that students are safely transported to and from school and other extracurricular activities. Additionally, the school is easily accessible via public transportation, making commuting convenient for all families. We prioritize student safety and comfort, providing a reliable and well-managed transportation system that supports our commitment to educational excellence`,
    images: [
      transportation1,
      transportation2,
      transportation3,
    ],
  },



  


  {
    id: 8,
    title: "Outdoor Learning Spaces",
    iconClass: "fas fa-seedling text-warning",
    description: `Our outdoor learning spaces include a dedicated garden and an open-air classroom designed to facilitate experiential learning. These areas enable students to immerse themselves in nature, conduct environmental science experiments, and partake in a variety of outdoor educational activities. They provide a revitalizing change from conventional indoor classrooms.`,
    images: [outdoor1, outdoor2, outdoor3],
  },


  {
    id: 9,
    title: "Infirmary",
    iconClass: "fas fa-stethoscope text-danger",
    description: `Our Infirmary is staffed with a dedicated full-time nurse who provides immediate care for minor health issues and emergencies. The infirmary is equipped to handle a range of medical needs, from routine check-ups to urgent situations. Our comprehensive health services include preventive care, health awareness, and coordination with local medical professionals. Our objective is to provide students with timely and effective care, as we prioritize their health and well-being. We believe that this focus allows students to concentrate on their education without the distraction of health-related issues.`,
    images: [
      infirmary1,
      infirmary2,
      infirmary3,
    ],
  },
];

export default infrastructureData;
