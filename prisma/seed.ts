// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// Define the type for CSV records
interface CSVRecord {
  name: string;
  profile_url?: string;
  gender: string;
  city: string;
  experience_years?: string;
  email?: string;
  emails_all?: string;
  phone?: string;
  modes?: string;
  education?: string;
  experience?: string;
  expertise?: string;
  about?: string;
  fees_raw?: string;
  fee_amount?: string;
  fee_currency?: string;
}

async function main() {
  console.log("Starting seed...");

  try {
    // Clear existing data
    await prisma.therapist.deleteMany();
    console.log("Cleared existing data");

    // Read CSV file
    const csvFilePath ="./pakmh_profiles.csv";
    console.log("Reading CSV from:", csvFilePath);

    const fileContent = readFileSync(csvFilePath, "utf-8");
    console.log("CSV file read successfully");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRecord[];

    console.log(`Found ${records.length} records to process`);

    // Process each record
    for (const [index, record] of records.entries()) {
      try {
        // Clean and parse data with proper type checking
        const experience_years =
          record.experience_years && record.experience_years.trim() !== ""
            ? parseFloat(record.experience_years)
            : null;

        const fee_amount =
          record.fee_amount && record.fee_amount.trim() !== ""
            ? parseInt(record.fee_amount)
            : null;

        await prisma.therapist.create({
          data: {
            name: record.name,
            profile_url: record.profile_url || null,
            gender: record.gender,
            city: record.city,
            experience_years: experience_years,
            email: record.email || null,
            emails_all: record.emails_all || null,
            phone: record.phone || null,
            modes: record.modes || null,
            education: record.education || null,
            experience: record.experience || null,
            expertise: record.expertise || null,
            about: record.about || null,
            fees_raw: record.fees_raw || null,
            fee_amount: fee_amount,
            fee_currency: record.fee_currency || "PKR",
          },
        });

        if (index % 10 === 0) {
          console.log(`Processed ${index + 1}/${records.length} records`);
        }
      } catch (error) {
        console.error(`Error processing record ${index}:`, record.name, error);
      }
    }

    console.log(`✅ Successfully seeded ${records.length} therapists`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
