const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");

const demoCategories = [
  {
    _id: "650000000000000000000001",
    name: "Web Development",
    description: "Master modern web development with HTML, CSS, JavaScript, React, Node.js, and Full-Stack MERN architecture.",
  },
  {
    _id: "650000000000000000000002",
    name: "Python & Data Science",
    description: "Learn Python programming, Machine Learning, Data Analysis, Pandas, NumPy, and AI algorithms.",
  },
  {
    _id: "650000000000000000000003",
    name: "Cyber Security",
    description: "Ethical hacking, network security, penetration testing, cryptography, and cyber threat intelligence.",
  },
  {
    _id: "650000000000000000000004",
    name: "Cloud Computing & DevOps",
    description: "Master AWS, Docker, Kubernetes, CI/CD pipelines, and scalable cloud infrastructure.",
  },
  {
    _id: "650000000000000000000005",
    name: "Android & App Development",
    description: "Build high-performance cross-platform mobile apps using Flutter, React Native, and Kotlin.",
  },
];

const demoCourses = [
  {
    _id: "650000000000000000000101",
    courseName: "The Complete Web Development Bootcamp 2026",
    courseDescription: "Become a full-stack MERN developer by building real-world web applications from scratch.",
    whatYouWillLearn: "Build responsive websites, master React.js, Express, MongoDB, Node.js, and deploy production apps.",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    tag: ["Web Development", "React", "NodeJS", "FullStack"],
    category: "650000000000000000000001",
    instructions: ["Prerequisites: None required", "Must have a laptop with internet connection"],
    status: "Published",
  },
  {
    _id: "650000000000000000000102",
    courseName: "Python for Data Science & Machine Learning Masterclass",
    courseDescription: "Comprehensive guide to Python programming, data analytics, visualization, and AI machine learning models.",
    whatYouWillLearn: "Analyze data using Pandas, create visualizations with Matplotlib, build ML models with Scikit-Learn.",
    price: 699,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    tag: ["Python", "Data Science", "Machine Learning", "AI"],
    category: "650000000000000000000002",
    instructions: ["Basic algebra helpful but not mandatory"],
    status: "Published",
  },
  {
    _id: "650000000000000000000103",
    courseName: "Ethical Hacking & Network Security Fundamentals",
    courseDescription: "Learn penetration testing, vulnerability assessment, wireless security, and system defense strategies.",
    whatYouWillLearn: "Perform ethical security audits, identify system vulnerabilities, secure network infrastructures.",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    tag: ["Cyber Security", "Ethical Hacking", "Networking"],
    category: "650000000000000000000003",
    instructions: ["For educational and authorized security testing only"],
    status: "Published",
  },
  {
    _id: "650000000000000000000104",
    courseName: "AWS Cloud Architect & DevOps Engineering",
    courseDescription: "Hands-on guide to Amazon Web Services (AWS), Docker containerization, Kubernetes, and CI/CD pipelines.",
    whatYouWillLearn: "Architect fault-tolerant cloud systems, automate deployments with CI/CD, orchestrate Docker containers.",
    price: 799,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    tag: ["AWS", "Cloud", "DevOps", "Docker", "Kubernetes"],
    category: "650000000000000000000004",
    instructions: ["Basic Linux command line experience is recommended"],
    status: "Published",
  },
];

async function seedDatabase() {
  try {
    // Check if database is empty or needs categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log("[Seed] Populating initial demo categories...");
      await Category.insertMany(demoCategories);
      console.log("[Seed] Demo categories created successfully!");
    }

    // The demo instructor has a publicly known password, so it (and the demo
    // courses that need it) are only created when explicitly enabled.
    if (process.env.SEED_DEMO_DATA !== "true") {
      return;
    }

    // Check if instructor user exists
    let instructor = await User.findOne({ accountType: "Instructor" });
    if (!instructor) {
      const hashedPassword = await bcrypt.hash("Password123", 10);
      const profile = await Profile.create({
        gender: "Other",
        dateOfBirth: "1995-01-01",
        about: "Expert Senior Software Engineer & Course Creator",
        contactNumber: "9876543210",
      });
      instructor = await User.create({
        firstName: "Demo",
        lastName: "Instructor",
        email: "instructor@studynotion.com",
        password: hashedPassword,
        accountType: "Instructor",
        additionalDetails: profile._id,
        image: "https://api.dicebear.com/5.x/initials/svg?seed=Demo%20Instructor",
      });
      console.log("[Seed] Demo Instructor created: instructor@studynotion.com / Password123");
    }

    // Seed courses if empty
    const courseCount = await Course.countDocuments();
    if (courseCount === 0 && instructor) {
      console.log("[Seed] Populating demo courses...");
      const coursesToInsert = demoCourses.map((c) => ({
        ...c,
        instructor: instructor._id,
      }));
      const createdCourses = await Course.insertMany(coursesToInsert);
      
      // Update categories with their course IDs
      for (const course of createdCourses) {
        await Category.findByIdAndUpdate(course.category, {
          $push: { courses: course._id },
        });
      }
      console.log("[Seed] Demo courses populated successfully!");
    }
  } catch (err) {
    console.error("[Seed] Error seeding demo data:", err.message);
  }
}

module.exports = {
  demoCategories,
  demoCourses,
  seedDatabase,
};
