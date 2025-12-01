import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Doctor (idempotent upsert)
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@ayurvedic.com' },
    update: {},
    create: {
      email: 'doctor@ayurvedic.com',
      name: 'Dr. Sarah Johnson',
      password: hashedPassword,
      role: 'DOCTOR',
      specialization: 'Ayurvedic Medicine',
      licenseNumber: 'AYU123456',
      experience: 10,
      phone: '+1-555-0123',
      address: '123 Wellness St, Health City, HC 12345',
      isActive: true
    }
  });

  // Create Patient (idempotent upsert)
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      name: 'Priya Sharma',
      password: hashedPassword,
      role: 'PATIENT',
      age: 35,
      gender: 'female',
      doshaType: 'PITTA',
      phone: '+1-555-0456',
      address: '456 Harmony Ave, Balance Town, BT 67890',
      medicalHistory: 'No significant medical history',
      allergies: 'None known',
      medications: 'None',
      isActive: true
    }
  });

  // Create additional Doctor (idempotent upsert)
  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.kumar@ayurvedic.com' },
    update: {},
    create: {
      email: 'dr.kumar@ayurvedic.com',
      name: 'Dr. Rajesh Kumar',
      password: hashedPassword,
      role: 'DOCTOR',
      specialization: 'Panchakarma Therapy',
      licenseNumber: 'AYU789012',
      experience: 15,
      phone: '+1-555-0789',
      address: '789 Healing Blvd, Wellness City, WC 54321',
      isActive: true
    }
  });

  // Create additional Patient (idempotent upsert)
  const patient2 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'PATIENT',
      age: 42,
      gender: 'male',
      doshaType: 'VATA',
      phone: '+1-555-0321',
      address: '321 Balance St, Harmony City, HC 98765',
      medicalHistory: 'Chronic stress, insomnia',
      allergies: 'Peanuts',
      medications: 'None',
      isActive: true
    }
  });

  // Create Patient records
  const patientRecord = await prisma.patient.create({
    data: {
      userId: patient.id,
      doctorId: doctor.id,
      patientCode: 'PAT001'
    }
  });

  const patientRecord2 = await prisma.patient.create({
    data: {
      userId: patient2.id,
      doctorId: doctor2.id,
      patientCode: 'PAT002'
    }
  });

  // Create sample foods
  const foods = await Promise.all([
    prisma.food.create({
      data: {
        name: 'Basmati Rice',
        description: 'Long-grain aromatic rice, cooling for Pitta',
        category: 'GRAINS',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        fiber: 0.4,
        doshaEffects: JSON.stringify({
          vata: 'neutral',
          pitta: 'cooling',
          kapha: 'neutral'
        }),
        benefits: JSON.stringify([
          'Easy to digest',
          'Cooling effect',
          'Good for Pitta constitution'
        ]),
        precautions: JSON.stringify([
          'Avoid if diabetic',
          'Moderate consumption recommended'
        ])
      }
    }),
    prisma.food.create({
      data: {
        name: 'Ghee',
        description: 'Clarified butter, excellent for all doshas',
        category: 'DAIRY',
        calories: 900,
        protein: 0,
        carbs: 0,
        fat: 100,
        fiber: 0,
        doshaEffects: JSON.stringify({
          vata: 'pacifying',
          pitta: 'cooling',
          kapha: 'neutral'
        }),
        benefits: JSON.stringify([
          'Enhances digestion',
          'Supports brain function',
          'Anti-inflammatory properties'
        ]),
        precautions: JSON.stringify([
          'Use in moderation',
          'Avoid if lactose intolerant'
        ])
      }
    }),
    prisma.food.create({
      data: {
        name: 'Turmeric',
        description: 'Golden spice with powerful healing properties',
        category: 'SPICES',
        calories: 354,
        protein: 7.8,
        carbs: 64.9,
        fat: 9.9,
        fiber: 21.1,
        doshaEffects: JSON.stringify({
          vata: 'pacifying',
          pitta: 'cooling',
          kapha: 'warming'
        }),
        benefits: JSON.stringify([
          'Anti-inflammatory',
          'Antioxidant properties',
          'Supports liver function',
          'Boosts immunity'
        ]),
        precautions: JSON.stringify([
          'Avoid in excess during pregnancy',
          'May interact with blood thinners'
        ])
      }
    }),
    prisma.food.create({
      data: {
        name: 'Mung Beans',
        description: 'Green gram, tridoshic and highly nutritious',
        category: 'LEGUMES',
        calories: 347,
        protein: 24,
        carbs: 63,
        fat: 1.2,
        fiber: 16.3,
        doshaEffects: JSON.stringify({
          vata: 'pacifying',
          pitta: 'cooling',
          kapha: 'neutral'
        }),
        benefits: JSON.stringify([
          'High protein content',
          'Easy to digest',
          'Detoxifying properties',
          'Good for all doshas'
        ]),
        precautions: JSON.stringify([
          'Soak before cooking',
          'Avoid if allergic to legumes'
        ])
      }
    }),
    prisma.food.create({
      data: {
        name: 'Coconut',
        description: 'Cooling fruit, excellent for Pitta constitution',
        category: 'FRUITS',
        calories: 354,
        protein: 3.3,
        carbs: 15.2,
        fat: 33.5,
        fiber: 9,
        doshaEffects: JSON.stringify({
          vata: 'neutral',
          pitta: 'cooling',
          kapha: 'warming'
        }),
        benefits: JSON.stringify([
          'Cooling effect',
          'Rich in healthy fats',
          'Supports hydration',
          'Good for skin health'
        ]),
        precautions: JSON.stringify([
          'Moderate consumption for Kapha',
          'Check for allergies'
        ])
      }
    })
  ]);

  // Create sample recipes
  const recipe = await prisma.recipe.create({
    data: {
      name: 'Kitchari',
      description: 'Traditional Ayurvedic one-pot meal, balancing for all doshas',
      instructions: `
1. Wash and soak mung beans and rice for 30 minutes
2. Heat ghee in a pot and add cumin seeds
3. Add turmeric, coriander, and other spices
4. Add drained rice and beans
5. Add water (3:1 ratio) and salt
6. Cook until soft and mushy
7. Garnish with fresh cilantro
      `,
      prepTime: 30,
      cookTime: 45,
      servings: 4,
      difficulty: 'easy'
    }
  });

  // Create recipe items
  await Promise.all([
    prisma.recipeItem.create({
      data: {
        recipeId: recipe.id,
        foodId: foods[0].id, // Basmati Rice
        quantity: 1,
        unit: 'cup'
      }
    }),
    prisma.recipeItem.create({
      data: {
        recipeId: recipe.id,
        foodId: foods[3].id, // Mung Beans
        quantity: 0.5,
        unit: 'cup'
      }
    }),
    prisma.recipeItem.create({
      data: {
        recipeId: recipe.id,
        foodId: foods[1].id, // Ghee
        quantity: 2,
        unit: 'tbsp'
      }
    }),
    prisma.recipeItem.create({
      data: {
        recipeId: recipe.id,
        foodId: foods[2].id, // Turmeric
        quantity: 1,
        unit: 'tsp'
      }
    })
  ]);

  // Create sample diet plan
  const dietPlan = await prisma.dietPlan.create({
    data: {
      name: 'Pitta Pacifying Diet Plan',
      description: 'Cooling diet plan designed for Pitta constitution',
      doctorId: doctor.id,
      patientId: patient.id,
      doshaType: 'PITTA',
      duration: 30
    }
  });

  // Create diet plan items
  await Promise.all([
    prisma.dietPlanItem.create({
      data: {
        dietPlanId: dietPlan.id,
        recipeId: recipe.id,
        mealType: 'LUNCH',
        quantity: 1,
        unit: 'serving',
        notes: 'Main meal of the day',
        dayOfWeek: 1, // Monday
        time: '12:00'
      }
    }),
    prisma.dietPlanItem.create({
      data: {
        dietPlanId: dietPlan.id,
        foodId: foods[4].id, // Coconut
        mealType: 'SNACK',
        quantity: 0.5,
        unit: 'cup',
        notes: 'Fresh coconut water',
        dayOfWeek: 1,
        time: '15:00'
      }
    })
  ]);

  // Create sample health records
  await Promise.all([
    prisma.healthRecord.create({
      data: {
        patientId: patient.id,
        date: new Date('2024-01-10'),
        weight: 65.5,
        height: 165,
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.5,
        symptoms: 'Mild digestive discomfort',
        diagnosis: 'Pitta imbalance',
        notes: 'Patient shows signs of Pitta aggravation, recommend cooling diet'
      }
    }),
    prisma.healthRecord.create({
      data: {
        patientId: patient2.id,
        date: new Date('2024-01-12'),
        weight: 78.2,
        height: 175,
        bloodPressure: '130/85',
        heartRate: 85,
        temperature: 36.8,
        symptoms: 'Anxiety, restlessness, dry skin',
        diagnosis: 'Vata imbalance',
        notes: 'Patient shows signs of Vata aggravation, recommend grounding practices'
      }
    })
  ]);

  // Create sample reminders
  await Promise.all([
    prisma.reminder.create({
      data: {
        userId: patient.id,
        title: 'Take Evening Meal',
        message: 'Remember to have your Kitchari dinner at 7 PM',
        date: new Date('2024-01-15'),
        time: '19:00'
      }
    }),
    prisma.reminder.create({
      data: {
        userId: patient2.id,
        title: 'Morning Meditation',
        message: 'Practice grounding meditation for 15 minutes',
        date: new Date('2024-01-20'),
        time: '07:00'
      }
    }),
    prisma.reminder.create({
      data: {
        userId: patient.id,
        title: 'Take Herbal Tea',
        message: 'Drink cooling herbal tea to balance Pitta',
        date: new Date('2024-01-16'),
        time: '16:00'
      }
    })
  ]);

  // Create sample chat messages
  await Promise.all([
    prisma.chatMessage.create({
      data: {
        senderId: doctor.id,
        receiverId: patient.id,
        patientId: patientRecord.id,
        message: 'Hello Priya! I have prepared your Pitta pacifying diet plan. Please follow it for the next 30 days and let me know how you feel.',
        isRead: false
      }
    }),
    prisma.chatMessage.create({
      data: {
        senderId: patient.id,
        receiverId: doctor.id,
        patientId: patientRecord.id,
        message: 'Thank you Dr. Johnson! I will start following the diet plan today. I have a question about the timing of meals.',
        isRead: true
      }
    }),
    prisma.chatMessage.create({
      data: {
        senderId: doctor2.id,
        receiverId: patient2.id,
        patientId: patientRecord2.id,
        message: 'Hello John! Your Vata balancing treatment plan is ready. We will focus on grounding practices and warm, nourishing foods.',
        isRead: false
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log('👨‍⚕️ Doctors created:', doctor.email, 'and', doctor2.email);
  console.log('👤 Patients created:', patient.email, 'and', patient2.email);
  console.log('🍚 Foods created:', foods.length);
  console.log('👨‍🍳 Recipe created:', recipe.name);
  console.log('📋 Diet plan created:', dietPlan.name);
  console.log('📊 Health records created: 2');
  console.log('⏰ Reminders created: 3');
  console.log('💬 Chat messages created: 3');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

