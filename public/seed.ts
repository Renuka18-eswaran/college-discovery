import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const districts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanniyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

const collegeTypes = [
  "Engineering College",
  "Institute of Technology",
  "College of Engineering",
  "Technical University",
  "Institute of Science and Technology",
  "College of Technology",
  "School of Engineering",
  "Institute of Engineering",
];

const specializations = [
  "Technology",
  "Engineering",
  "Science",
  "Information Technology",
  "Computer Science",
  "Applied Engineering",
  "Advanced Technology",
  "Technical Studies",
  "Innovation and Technology",
  "Engineering and Management",
  "Science and Technology",
  "Digital Technology",
];

const courses = [
  {
    name: "B.Tech in Computer Science and Engineering",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 480000,
    seats: 120,
  },
  {
    name: "B.Tech in Information Technology",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 460000,
    seats: 90,
  },
  {
    name: "B.Tech in Electronics and Communication Engineering",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 440000,
    seats: 90,
  },
  {
    name: "B.Tech in Mechanical Engineering",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 420000,
    seats: 90,
  },
  {
    name: "B.Tech in Electrical and Electronics Engineering",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 430000,
    seats: 60,
  },
  {
    name: "B.Tech in Civil Engineering",
    degree: "B.Tech",
    durationYears: 4,
    feesTotal: 400000,
    seats: 60,
  },
];

const recruiters = [
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Cognizant",
  "Capgemini",
  "HCL",
  "Zoho",
];

const prefixes = [
  "Sri",
  "Sree",
  "Royal",
  "Greenfield",
  "National",
  "Tamil Nadu",
  "Southern",
  "Kaveri",
  "Bharathi",
  "Vivekananda",
  "Pioneer",
  "Crescent",
  "Rising",
  "Future",
  "Global",
  "United",
  "Modern",
  "Prime",
  "Elite",
  "Vision",
  "Bright",
  "Knowledge",
  "Innovative",
  "Progressive",
  "Universal",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createCollegeName(
  district: string,
  index: number
) {
  const prefix =
    prefixes[index % prefixes.length];

  const type =
    collegeTypes[index % collegeTypes.length];

  const specialization =
    specializations[index % specializations.length];

  return `${prefix} ${district} ${specialization} ${type}`;
}

async function main() {
  console.log("🌱 Starting College Discovery seed...");

  // Delete old data
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});

  console.log("🗑️ Old college data deleted.");

  const colleges = [];

  // Generate exactly 450 colleges
  for (let i = 0; i < 450; i++) {
    const district =
      districts[i % districts.length];

    const collegeName =
      createCollegeName(district, i);

    const slug =
      `${slugify(collegeName)}-${i + 1}`;

    const rating =
      Number(
        (
          3.5 +
          ((i * 7) % 15) / 10
        ).toFixed(1)
      );

    const reviewCount =
      50 + ((i * 37) % 900);

    const fees =
      100000 +
      ((i * 17000) % 450000);

    const establishedYear =
      1985 + ((i * 3) % 38);

    const selectedCourses =
      courses
        .slice(0, 3 + (i % 4))
        .map((course) => ({
          ...course,
          feesTotal:
            course.feesTotal +
            ((i * 5000) % 100000),
        }));

    colleges.push({
      slug,
      name: collegeName,
      city: district,
      state: "Tamil Nadu",

      type:
        collegeTypes[
          i % collegeTypes.length
        ],

      establishedYear,
      rating,
      reviewCount,

      avgFeesPerYear: fees,

      description:
        `${collegeName} is a higher education institution located in ${district}, Tamil Nadu. The institution offers undergraduate and postgraduate programs with a focus on engineering, technology and professional education.`,

      streams:
        "Engineering,Technology,Computer Science,Management",

      campusSizeAcres:
        Number(
          (
            15 +
            ((i * 13) % 100) / 2
          ).toFixed(1)
        ),

      heroColor:
        [
          "#14532D",
          "#166534",
          "#365314",
          "#78350F",
          "#854D0E",
        ][i % 5],

      courses: {
        create: selectedCourses,
      },

      placements: {
        create: [2023, 2024, 2025].map(
          (year, yearIndex) => ({
            year,

            avgPackageLPA:
              Number(
                (
                  4.2 +
                  (
                    (i * 3 +
                      yearIndex * 4) %
                    45
                  ) /
                    10
                ).toFixed(1)
              ),

            highestPackageLPA:
              Number(
                (
                  8 +
                  (
                    (i * 5 +
                      yearIndex * 7) %
                    180
                  ) /
                    10
                ).toFixed(1)
              ),

            medianPackageLPA:
              Number(
                (
                  3.5 +
                  (
                    (i * 2 +
                      yearIndex * 3) %
                    35
                  ) /
                    10
                ).toFixed(1)
              ),

            placementPercent:
              60 +
              (
                (i * 11 +
                  yearIndex * 5) %
                36
              ),

            topRecruiters:
              recruiters
                .slice(0, 4)
                .join(","),
          })
        ),
      },

      reviews: {
        create: [
          {
            authorName: "Student A",
            rating: 4.1,
            title:
              "Good academic environment",
            content:
              "The college provides good facilities and academic support. Students have opportunities to participate in technical activities and projects.",
            pros:
              "Good faculty, technical activities",
            cons:
              "Hostel facilities can improve",
          },
          {
            authorName: "Student B",
            rating: 3.8,
            title:
              "Good campus experience",
            content:
              "Overall campus experience is good. The college provides opportunities for learning, placements and extracurricular activities.",
            pros:
              "Good campus, placement support",
            cons:
              "Limited extracurricular options",
          },
        ],
      },
    });
  }

  console.log(
    `📚 Preparing ${colleges.length} unique colleges...`
  );

  for (const college of colleges) {
    await prisma.college.create({
      data: college,
    });
  }

  console.log(
    `✅ Successfully created ${colleges.length} UNIQUE colleges!`
  );

  console.log(
    `📍 Distributed across ${districts.length} Tamil Nadu districts.`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });