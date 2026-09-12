// One-off generator: produces prisma/seed-data.ts with deterministic,
// realistic-looking mock data. Not part of the runtime app.
const fs = require("fs");
const path = require("path");

const cities = [
  ["Bengaluru", "Karnataka"], ["Mumbai", "Maharashtra"], ["Delhi", "Delhi"],
  ["Chennai", "Tamil Nadu"], ["Hyderabad", "Telangana"], ["Pune", "Maharashtra"],
  ["Kolkata", "West Bengal"], ["Ahmedabad", "Gujarat"], ["Jaipur", "Rajasthan"],
  ["Chandigarh", "Chandigarh"], ["Kanpur", "Uttar Pradesh"], ["Kharagpur", "West Bengal"],
  ["Roorkee", "Uttarakhand"], ["Vellore", "Tamil Nadu"], ["Manipal", "Karnataka"],
  ["Coimbatore", "Tamil Nadu"], ["Indore", "Madhya Pradesh"], ["Lucknow", "Uttar Pradesh"],
  ["Bhopal", "Madhya Pradesh"], ["Patiala", "Punjab"], ["Nagpur", "Maharashtra"],
];

const namePatterns = [
  (c) => `Indian Institute of Technology, ${c}`,
  (c) => `National Institute of Technology, ${c}`,
  (c) => `${c} Institute of Management`,
  (c) => `${c} College of Engineering`,
  (c) => `${c} Institute of Technology and Science`,
  (c) => `St. Xavier's College, ${c}`,
  (c) => `${c} University`,
  (c) => `${c} School of Business`,
  (c) => `${c} Institute of Engineering & Management`,
  (c) => `Birla Institute of Technology, ${c}`,
];

const types = ["Government", "Private", "Deemed"];
const streamSets = [
  ["Engineering"],
  ["Engineering", "Management"],
  ["Management"],
  ["Engineering", "Science"],
  ["Science", "Arts"],
  ["Management", "Commerce"],
  ["Engineering", "Architecture"],
];
const degreesByStream = {
  Engineering: [["B.Tech", 4], ["M.Tech", 2]],
  Management: [["MBA", 2], ["BBA", 3]],
  Science: [["B.Sc", 3], ["M.Sc", 2]],
  Arts: [["BA", 3]],
  Commerce: [["B.Com", 3]],
  Architecture: [["B.Arch", 5]],
};
const branches = ["Computer Science", "Electronics & Communication", "Mechanical", "Civil", "Electrical", "Information Technology", "Chemical", "Data Science"];
const recruiterPool = ["TCS", "Infosys", "Google", "Microsoft", "Amazon", "Deloitte", "Accenture", "Wipro", "Goldman Sachs", "JP Morgan", "Flipkart", "Adobe", "Cisco", "Samsung", "EY", "McKinsey & Co.", "BCG", "HCL", "Capgemini", "Qualcomm"];
const heroColors = ["#1B2340", "#3A2E5C", "#0F3D3E", "#4A2E2E", "#2B3A2E", "#1E2A4A", "#3D2B1F"];

function pick(arr, n, seedOffset) {
  const shuffled = [...arr].sort((a, b) => (hash(a + seedOffset) - hash(b + seedOffset)));
  return shuffled.slice(0, n);
}
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const colleges = [];
let idx = 0;
for (const [city, state] of cities) {
  const patternsForCity = pick(namePatterns.map((_, i) => i), 2, city);
  for (const pIdx of patternsForCity) {
    idx++;
    const name = namePatterns[pIdx](city);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const type = types[idx % types.length];
    const streams = streamSets[idx % streamSets.length];
    const established = 1950 + Math.floor(seededRand(idx * 7.1) * 70);
    const rating = Math.round((3.2 + seededRand(idx * 3.3) * 1.7) * 10) / 10;
    const reviewCount = 20 + Math.floor(seededRand(idx * 5.5) * 900);
    const isTop = /Indian Institute of Technology|National Institute of Technology/.test(name);
    const baseFees = isTop ? 180000 + seededRand(idx * 1.2) * 60000 : 60000 + seededRand(idx * 1.2) * 280000;
    const avgFeesPerYear = Math.round(baseFees / 1000) * 1000;
    const campusSizeAcres = Math.round((30 + seededRand(idx * 2.1) * 350) * 10) / 10;
    const heroColor = heroColors[idx % heroColors.length];

    const courses = [];
    for (const stream of streams) {
      const degs = degreesByStream[stream] || [["B.A", 3]];
      for (const [degree, duration] of degs) {
        const branchList = stream === "Engineering" ? pick(branches, 3, name + degree) : [null];
        for (const branch of branchList) {
          courses.push({
            name: branch ? `${degree} in ${branch}` : degree,
            degree,
            durationYears: duration,
            feesTotal: Math.round((avgFeesPerYear * duration) / 1000) * 1000,
            seats: 30 + Math.floor(seededRand(hash(name + degree + branch) ) * 90),
          });
        }
      }
    }

    const placements = [2023, 2024, 2025].map((year, yi) => {
      const growth = 1 + yi * 0.08;
      const base = isTop ? 18 : 6;
      const avg = Math.round(base * growth * (0.85 + seededRand(idx * year) * 0.4) * 10) / 10;
      return {
        year,
        avgPackageLPA: avg,
        highestPackageLPA: Math.round(avg * (2.2 + seededRand(idx + year) * 1.5) * 10) / 10,
        medianPackageLPA: Math.round(avg * 0.85 * 10) / 10,
        placementPercent: Math.min(99, Math.round(60 + seededRand(idx * year * 1.1) * 38)),
        topRecruiters: pick(recruiterPool, 6, name + year).join(","),
      };
    });

    const reviewTemplates = [
      { title: "Great placements and faculty support", pros: "Strong industry connect, active alumni network", cons: "Hostel food could improve" },
      { title: "Solid academics, campus life is average", pros: "Good labs, research opportunities", cons: "Limited extracurricular budget" },
      { title: "Worth it for the brand name", pros: "Recognized degree, good starting packages", cons: "High fees relative to smaller colleges" },
      { title: "Faculty is hit or miss", pros: "Some excellent professors, good peer group", cons: "Outdated curriculum in a few departments" },
    ];
    const reviews = pick(reviewTemplates.map((_, i) => i), 3, name).map((ti, ri) => {
      const t = reviewTemplates[ti];
      return {
        authorName: ["Ananya R.", "Rohit K.", "Priya S.", "Vikram T.", "Neha M.", "Arjun D."][(idx + ri) % 6],
        rating: Math.max(2.5, Math.min(5, rating + (seededRand(idx + ri) - 0.5))),
        title: t.title,
        content: `${t.title}. ${t.pros}. That said, ${t.cons.toLowerCase()}. Overall a decent experience at ${name.split(",")[0]}.`,
        pros: t.pros,
        cons: t.cons,
      };
    });

    colleges.push({
      slug, name, city, state, type,
      establishedYear: established,
      rating, reviewCount, avgFeesPerYear,
      description: `${name} is a ${type.toLowerCase()} institution established in ${established}, offering programs in ${streams.join(" and ")}. Located in ${city}, ${state}, it is known for ${isTop ? "its rigorous academics and strong industry placements" : "a growing reputation and improving placement record"}.`,
      streams: streams.join(","),
      campusSizeAcres,
      heroColor,
      courses, placements, reviews,
    });
  }
}

const out = `// AUTO-GENERATED seed data — used by prisma/seed.ts
// Regenerate with: node prisma/generate-seed-data.js
export const collegeSeedData = ${JSON.stringify(colleges, null, 2)} as const;
`;
fs.writeFileSync(path.join(__dirname, "seed-data.ts"), out);
console.log(`Generated ${colleges.length} colleges -> prisma/seed-data.ts`);
