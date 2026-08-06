require("dotenv").config();
const mongoose = require("mongoose");
const blogModel = require("../Models/BlogSchema");
const activitiesModel = require("../Models/actvitiesSchema");

const mongoURI = process.env.DataBase;

if (!mongoURI) {
  console.error("MongoDB connection URI not found in .env!");
  process.exit(1);
}

// Industry-standard Rich HTML Generator function for Blogs
function generateRichBlogHTML(title) {
  return `
<div className="blog-rich-content">
  <p className="lead" style="font-size: 1.15rem; line-height: 1.8; color: #334155; margin-bottom: 1.5rem;">
    At <strong style="color: #196642;">Aksharaa School</strong>, education extends far beyond conventional classroom walls. We believe in nurturing curious minds, fostering holistic development, and cultivating values that empower our students to become confident global citizens of tomorrow.
  </p>

  <h2 style="color: #0f172a; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">
    1. Comprehensive Educational Vision
  </h2>
  <p style="font-size: 1rem; line-height: 1.7; color: #475569; margin-bottom: 1.25rem;">
    Our curriculum integrates the <span style="background-color: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 600;">L-R-P-A Model</span> (Learning, Reflection, Performance, and Assessment) to ensure every student grasps foundational concepts deeply while discovering their personal passions.
  </p>

  <blockquote style="border-left: 4px solid #196642; padding: 14px 20px; background: #f0fdf4; margin: 1.75rem 0; border-radius: 0 10px 10px 0; font-style: italic; color: #166534; font-size: 1.05rem;">
    "Education is not the learning of facts, but the training of the mind to think." &mdash; Albert Einstein
  </blockquote>

  <h3 style="color: #0f172a; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem;">
    Key Learning Milestones
  </h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #334155; line-height: 1.8;">
    <li><strong style="color: #196642;">Experiential Learning:</strong> Interactive hands-on projects, STEM experiments, and real-world problem-solving modules.</li>
    <li><strong style="color: #196642;">Character Building:</strong> Inculcating moral integrity, empathy, and leadership ethics through community outreach.</li>
    <li><strong style="color: #196642;">Digital Literacy:</strong> Smart classrooms equipped with modern technologies and interactive multimedia tools.</li>
  </ul>

  <h2 style="color: #0f172a; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">
    2. Student Engagement & Skill Highlights
  </h2>
  <p style="font-size: 1rem; line-height: 1.7; color: #475569; margin-bottom: 1.25rem;">
    Students engage in collaborative group activities designed to sharpen their analytical skills, communication, and emotional resilience:
  </p>

  <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Program Dimension</th>
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Core Focus</th>
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Student Outcome</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Academic Mastery</td>
        <td style="padding: 10px 14px; color: #475569;">Conceptual Clarity & Problem Solving</td>
        <td style="padding: 10px 14px; color: #475569;">Higher-order Thinking</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Co-Curricular Exploration</td>
        <td style="padding: 10px 14px; color: #475569;">Arts, Sports, Robotics & Performing Arts</td>
        <td style="padding: 10px 14px; color: #475569;">Creative Expression</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Global Leadership</td>
        <td style="padding: 10px 14px; color: #475569;">Model United Nations & Public Speaking</td>
        <td style="padding: 10px 14px; color: #475569;">Confidence & Diplomacy</td>
      </tr>
    </tbody>
  </table>

  <h2 style="color: #0f172a; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">
    3. Key Takeaways for Parents & Educators
  </h2>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #334155; line-height: 1.8;">
    <li>Encourage open dialogue and curiosity at home to complement school learning.</li>
    <li>Support participation in diverse extra-curricular activities for well-rounded growth.</li>
    <li>Partner with educators during regular parent-teacher interactions to track developmental milestones.</li>
  </ol>

  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 1.25rem 1.5rem; border-radius: 12px; margin-top: 2rem;">
    <h4 style="margin: 0 0 0.5rem 0; color: #196642; font-weight: 700;">Conclusion</h4>
    <p style="margin: 0; color: #475569; font-size: 0.98rem; line-height: 1.6;">
      At Aksharaa, every day brings new opportunities for discovery, creative expression, and intellectual growth. We remain steadfast in our commitment to inspiring excellence in every child.
    </p>
  </div>
</div>
`.trim();
}

// Industry-standard Rich HTML Generator function for Activities
function generateRichActivityHTML(title) {
  return `
<div className="activity-rich-content">
  <p className="lead" style="font-size: 1.15rem; line-height: 1.8; color: #334155; margin-bottom: 1.5rem;">
    Aksharaa School proudly celebrated <strong style="color: #196642;">${title}</strong> with immense enthusiasm, creative energy, and active participation across all grade levels.
  </p>

  <h2 style="color: #0f172a; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">
    Event Highlights & Highlights Summary
  </h2>
  <p style="font-size: 1rem; line-height: 1.7; color: #475569; margin-bottom: 1.25rem;">
    The event showcased extraordinary talent, teamwork, and enthusiasm as students demonstrated their skills across various interactive sessions:
  </p>

  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #334155; line-height: 1.8;">
    <li><strong style="color: #196642;">Active Participation:</strong> Over <span style="background-color: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: 600;">500+ students</span> participated in various competitions, interactive workshops, and performances.</li>
    <li><strong style="color: #196642;">Mentorship & Guidance:</strong> Expert teachers and guest mentors guided students throughout the preparation and execution.</li>
    <li><strong style="color: #196642;">Community Engagement:</strong> Parents and guardians witnessed heartwarming performances and creative project exhibitions.</li>
  </ul>

  <div style="background-color: #f0fdf4; border-left: 4px solid #196642; padding: 1.25rem 1.5rem; border-radius: 0 10px 10px 0; margin: 1.75rem 0;">
    <h4 style="margin: 0 0 0.4rem 0; color: #166534; font-weight: 700;">Event Impact & Learning Outcomes</h4>
    <p style="margin: 0; color: #166534; font-size: 0.98rem; line-height: 1.6;">
      Activities like ${title} build self-confidence, foster team spirit, and cultivate critical life skills that prepare students to excel in real-world environments.
    </p>
  </div>

  <h3 style="color: #0f172a; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem;">
    Event Schedule & Milestones
  </h3>
  <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Phase / Time</th>
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Activity Focus</th>
        <th style="padding: 10px 14px; text-align: left; color: #0f172a; font-weight: 600;">Location / Stage</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Opening Ceremony</td>
        <td style="padding: 10px 14px; color: #475569;">Welcome Address & Cultural Performances</td>
        <td style="padding: 10px 14px; color: #475569;">Main Auditorium</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Interactive Workshops</td>
        <td style="padding: 10px 14px; color: #475569;">Student Exhibitions & Competitions</td>
        <td style="padding: 10px 14px; color: #475569;">Learning Centers & Courtyard</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #196642;">Awards & Closing</td>
        <td style="padding: 10px 14px; color: #475569;">Felicitation of Winners & Reflection</td>
        <td style="padding: 10px 14px; color: #475569;">School Hall</td>
      </tr>
    </tbody>
  </table>

  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 1.25rem 1.5rem; border-radius: 12px; margin-top: 2rem;">
    <h4 style="margin: 0 0 0.5rem 0; color: #196642; font-weight: 700;">Summary</h4>
    <p style="margin: 0; color: #475569; font-size: 0.98rem; line-height: 1.6;">
      We extend our heartfelt gratitude to our management, dedicated teachers, energetic students, and supportive parents for making ${title} a grand success.
    </p>
  </div>
</div>
`.trim();
}

async function enrichDatabase() {
  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected successfully!");

    // 1. Update Blogs
    const blogs = await blogModel.find();
    console.log(`Found ${blogs.length} blog posts to enrich with industry-standard rich HTML...`);

    let blogsUpdated = 0;
    for (const blog of blogs) {
      const richHTML = generateRichBlogHTML(blog.title);
      const cleanExcerpt = blog.excerpt && blog.excerpt.length > 20
        ? blog.excerpt
        : `Explore ${blog.title} at Aksharaa School. Discover our value-based education, experiential learning milestones, and student leadership opportunities.`;

      await blogModel.findByIdAndUpdate(blog._id, {
        description: richHTML,
        excerpt: cleanExcerpt,
        readTime: blog.readTime || "4 min read",
        author: blog.author || "Aksharaa School Editorial",
      });
      blogsUpdated++;
    }
    console.log(`Successfully updated ${blogsUpdated} blog posts with rich formatted content!`);

    // 2. Update Activities
    const activities = await activitiesModel.find();
    console.log(`Found ${activities.length} activity posts to enrich with industry-standard rich HTML...`);

    let activitiesUpdated = 0;
    for (const act of activities) {
      const richHTML = generateRichActivityHTML(act.title);
      const cleanExcerpt = act.excerpt && act.excerpt.length > 20
        ? act.excerpt
        : `Highlights and insights from ${act.title} at Aksharaa School. Read about student achievements, workshops, and event moments.`;

      await activitiesModel.findByIdAndUpdate(act._id, {
        description: richHTML,
        excerpt: cleanExcerpt,
        location: act.location || "Aksharaa School Campus",
      });
      activitiesUpdated++;
    }
    console.log(`Successfully updated ${activitiesUpdated} activity posts with rich formatted content!`);

    console.log("All database blogs and activities enriched successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error enriching database records:", error);
    process.exit(1);
  }
}

enrichDatabase();
