/* ===============================================================
   BASE44 NUTRITION ENGINE
   Embedded from the nutritionEngine.js supplied by the user.
   Function names are prefixed with "engine" to avoid collisions.
   =============================================================== */
// NutriAI - Core Nutrition Calculation Engine



function engineCalculateBMI(weightKg, heightCm) {

  const heightM = heightCm / 100;

  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));

}



function engineGetBMICategory(bmi) {

  if (bmi < 18.5) return "Underweight";

  if (bmi < 25) return "Normal Weight";

  if (bmi < 30) return "Overweight";

  return "Obese";

}



function engineCalculateBMR(weightKg, heightCm, age, gender) {

  if (gender === "Male") {

    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

  }

  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

}



function engineCalculateDailyCalories(bmr, activityLevel, healthGoal) {

  const activityMultipliers = {

    "Sedentary": 1.2,

    "Lightly Active": 1.375,

    "Moderately Active": 1.55,

    "Very Active": 1.725,

  };

  let tdee = bmr * (activityMultipliers[activityLevel] || 1.2);



  switch (healthGoal) {

    case "Weight Loss": return Math.round(tdee - 500);

    case "Weight Gain": return Math.round(tdee + 400);

    case "Muscle Building": return Math.round(tdee + 300);

    default: return Math.round(tdee);

  }

}



function engineCalculateWaterIntake(weightKg, activityLevel) {

  let base = weightKg * 0.033;

  const extra = {

    "Sedentary": 0,

    "Lightly Active": 0.3,

    "Moderately Active": 0.5,

    "Very Active": 0.8,

  };

  return parseFloat((base + (extra[activityLevel] || 0)).toFixed(1));

}



function engineCalculateMacros(dailyCalories, healthGoal) {

  let proteinPct, carbsPct, fatPct;

  switch (healthGoal) {

    case "Weight Loss":

      proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30; break;

    case "Weight Gain":

      proteinPct = 0.25; carbsPct = 0.50; fatPct = 0.25; break;

    case "Muscle Building":

      proteinPct = 0.40; carbsPct = 0.35; fatPct = 0.25; break;

    default:

      proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;

  }

  return {

    protein: Math.round((dailyCalories * proteinPct) / 4),

    carbs: Math.round((dailyCalories * carbsPct) / 4),

    fat: Math.round((dailyCalories * fatPct) / 9),

    fiber: healthGoal === "Weight Loss" ? 30 : 25,

  };

}



function engineCalculateWellnessScore(profile) {

  let score = 50;

  const bmi = profile.bmi || engineCalculateBMI(profile.weight_kg, profile.height_cm);



  if (bmi >= 18.5 && bmi < 25) score += 20;

  else if (bmi >= 25 && bmi < 30) score += 10;

  else score += 0;



  if (profile.activity_level === "Very Active") score += 15;

  else if (profile.activity_level === "Moderately Active") score += 12;

  else if (profile.activity_level === "Lightly Active") score += 8;

  else score += 3;



  if (profile.dietary_preference === "Vegan") score += 5;

  else if (profile.dietary_preference === "Vegetarian") score += 4;

  else score += 3;



  const conditions = profile.existing_conditions || [];

  score -= conditions.length * 3;



  if (profile.age < 30) score += 5;

  else if (profile.age < 50) score += 3;



  return Math.max(10, Math.min(100, score));

}



function engineGetExerciseRecommendation(profile) {

  const bmiCat = profile.bmi_category || engineGetBMICategory(profile.bmi);

  const goal = profile.health_goal;

  const conditions = profile.existing_conditions || [];

  const hasJointIssues = conditions.some(c => c.toLowerCase().includes("arthritis") || c.toLowerCase().includes("joint"));

  const hasHeart = conditions.some(c => c.toLowerCase().includes("heart") || c.toLowerCase().includes("hypertension") || c.toLowerCase().includes("blood pressure"));



  let exercises = [];

  let reasoning = "";



  if (goal === "Weight Loss") {

    exercises = hasJointIssues

      ? ["Swimming — 30 min", "Cycling (low resistance) — 25 min", "Chair yoga — 20 min", "Walking — 40 min"]

      : ["Brisk walking — 40 min", "Jogging — 25 min", "Skipping rope — 15 min", "Bodyweight squats — 3 sets of 15"];

    reasoning = "Cardio exercises burn more calories and create a caloric deficit, supporting weight loss.";

  } else if (goal === "Muscle Building") {

    exercises = ["Push-ups — 4 sets of 12", "Pull-ups or resistance bands — 3 sets of 10", "Squats with weights — 4 sets of 12", "Plank — 3 sets of 45 seconds"];

    reasoning = "Resistance training stimulates muscle protein synthesis, essential for building muscle mass.";

  } else if (goal === "Weight Gain") {

    exercises = ["Weight training — 40 min", "Compound lifts (squats, deadlifts) — 30 min", "Light cardio (walking) — 15 min", "Stretching — 10 min"];

    reasoning = "Strength training with adequate nutrition helps gain healthy weight as muscle rather than fat.";

  } else {

    exercises = ["Yoga — 30 min", "Walking — 30 min", "Light stretching — 15 min", "Breathing exercises — 10 min"];

    reasoning = "A balanced mix of flexibility, light cardio, and mindfulness supports overall wellness.";

  }



  if (hasHeart) {

    exercises = ["Gentle walking — 20 min", "Light yoga — 20 min", "Deep breathing — 15 min", "Stretching — 10 min"];

    reasoning += " Modified for heart health: low-intensity exercises reduce cardiovascular strain.";

  }



  return { exercises, reasoning, duration: "30-45 minutes daily", frequency: "5-6 days a week" };

}



function engineGetSleepRecommendation(age) {

  if (age < 13) return { hours: "9-11 hours", tip: "Children need more sleep for growth and brain development." };

  if (age < 18) return { hours: "8-10 hours", tip: "Teens need extra sleep due to rapid growth and hormonal changes." };

  if (age < 65) return { hours: "7-9 hours", tip: "Adults need consistent sleep for recovery, immunity, and mental clarity." };

  return { hours: "7-8 hours", tip: "Older adults benefit from regular sleep patterns for cognitive health." };

}



function engineGetDeficiencyRisks(profile) {

  const risks = [];

  const diet = profile.dietary_preference;

  const conditions = profile.existing_conditions || [];

  const age = profile.age;

  const gender = profile.gender;



  if (diet === "Vegan") {

    risks.push({ nutrient: "Vitamin B12", risk: "High", reason: "Vegan diets lack B12, found mainly in animal products.", foods: "Fortified cereals, nutritional yeast, fortified soy milk" });

    risks.push({ nutrient: "Iron", risk: "Moderate", reason: "Plant-based iron (non-heme) is less easily absorbed.", foods: "Spinach, lentils, tofu, pumpkin seeds" });

    risks.push({ nutrient: "Calcium", risk: "Moderate", reason: "Dairy-free diets may lack calcium.", foods: "Broccoli, almonds, fortified plant milk, sesame seeds" });

    risks.push({ nutrient: "Omega-3", risk: "High", reason: "Fish is the primary source of EPA and DHA.", foods: "Flaxseeds, chia seeds, walnuts, algae oil" });

  }

  if (diet === "Vegetarian") {

    risks.push({ nutrient: "Vitamin B12", risk: "Moderate", reason: "Limited sources in vegetarian diets.", foods: "Milk, curd, paneer, fortified cereals" });

    risks.push({ nutrient: "Iron", risk: "Low-Moderate", reason: "Plant iron is less bioavailable than meat iron.", foods: "Spinach, jaggery, dates, beetroot" });

  }

  if (gender === "Female" && age >= 12 && age <= 50) {

    risks.push({ nutrient: "Iron", risk: "Moderate", reason: "Women of menstruating age need more iron.", foods: "Green leafy vegetables, pomegranate, dates, lentils" });

  }

  if (age > 50) {

    risks.push({ nutrient: "Vitamin D", risk: "Moderate", reason: "Aging reduces the skin's ability to produce Vitamin D.", foods: "Sunlight exposure, fortified milk, mushrooms, egg yolk" });

    risks.push({ nutrient: "Calcium", risk: "Moderate", reason: "Bone density decreases with age.", foods: "Milk, curd, ragi, almonds, broccoli" });

  }

  if (conditions.some(c => c.toLowerCase().includes("diabetes"))) {

    risks.push({ nutrient: "Chromium", risk: "Moderate", reason: "Chromium helps with insulin sensitivity.", foods: "Broccoli, green beans, whole grains, nuts" });

    risks.push({ nutrient: "Magnesium", risk: "Moderate", reason: "Diabetes can lower magnesium levels.", foods: "Pumpkin seeds, almonds, spinach, dark chocolate" });

  }

  if (risks.length === 0) {

    risks.push({ nutrient: "General", risk: "Low", reason: "Your profile looks balanced. Maintain a varied diet.", foods: "Eat a variety of colorful fruits and vegetables daily" });

  }

  return risks;

}



function engineGetDiseaseGuidance(conditions) {

  const guidance = {};

  conditions.forEach(condition => {

    const c = condition.toLowerCase();

    if (c.includes("diabetes")) {

      guidance["Diabetes"] = {

        foods_to_eat: ["Bitter gourd, methi seeds, whole grains, oats, barley", "Green vegetables, salads, cucumber", "Moong dal, masoor dal, sprouts", "Cinnamon, turmeric, fenugreek water"],

        foods_to_avoid: ["White rice (in excess), white bread, sugary drinks", "Fried snacks, sweets, jaggery in large amounts", "Fruit juices (prefer whole fruits)"],

        reasoning: "Low glycemic index foods help manage blood sugar levels. Fiber slows sugar absorption.",

        tip: "Eat small, frequent meals. Never skip breakfast. Monitor blood sugar regularly."

      };

    }

    if (c.includes("hypertension") || c.includes("blood pressure") || c.includes("bp")) {

      guidance["Hypertension"] = {

        foods_to_eat: ["Bananas, oranges, spinach (rich in potassium)", "Oats, whole wheat, brown rice", "Garlic, beetroot, flaxseeds", "Low-fat curd, buttermilk"],

        foods_to_avoid: ["Excess salt, pickles, papad", "Processed and packaged foods", "Red meat, fried foods"],

        reasoning: "Potassium-rich foods counterbalance sodium. Low-sodium diets help lower blood pressure.",

        tip: "Limit salt to less than 5g per day. Practice deep breathing and regular walking."

      };

    }

    if (c.includes("thyroid")) {

      guidance["Thyroid"] = {

        foods_to_eat: ["Iodized salt, seafood, eggs", "Brazil nuts (selenium), pumpkin seeds", "Coconut oil, whole grains"],

        foods_to_avoid: ["Raw cruciferous vegetables in excess (cabbage, cauliflower, broccoli)", "Soy products in excess", "Highly processed foods"],

        reasoning: "Iodine and selenium are essential for thyroid hormone production. Goitrogens in raw form may interfere.",

        tip: "Cook cruciferous vegetables before eating. Get thyroid levels checked regularly."

      };

    }

    if (c.includes("pcos") || c.includes("pcod")) {

      guidance["PCOS/PCOD"] = {

        foods_to_eat: ["High-fiber foods: oats, whole grains, flaxseeds", "Anti-inflammatory: turmeric, green tea, berries", "Lean protein: dal, paneer, chicken breast"],

        foods_to_avoid: ["Refined carbs, white bread, sugary foods", "Dairy in excess (for some individuals)", "Fried and processed foods"],

        reasoning: "Managing insulin resistance through low-GI foods helps regulate hormones in PCOS.",

        tip: "Regular exercise and stress management are equally important as diet."

      };

    }

    if (c.includes("cholesterol")) {

      guidance["High Cholesterol"] = {

        foods_to_eat: ["Oats, barley, almonds, walnuts", "Olive oil, flaxseeds, fish", "Garlic, green tea, soy products"],

        foods_to_avoid: ["Butter, ghee in excess, full-fat cheese", "Fried foods, processed meats", "Egg yolk in excess"],

        reasoning: "Soluble fiber binds to cholesterol and removes it. Omega-3 fatty acids improve HDL (good cholesterol).",

        tip: "30 minutes of cardio daily can raise HDL cholesterol by 5-10%."

      };

    }

    if (c.includes("anemia")) {

      guidance["Anemia"] = {

        foods_to_eat: ["Spinach, beetroot, pomegranate, dates", "Jaggery, raisins, black sesame seeds", "Lentils, kidney beans, chickpeas", "Vitamin C foods with iron (lemon, amla) for better absorption"],

        foods_to_avoid: ["Tea/coffee immediately after meals (blocks iron absorption)", "Excess calcium supplements with iron-rich meals"],

        reasoning: "Iron is essential for hemoglobin production. Vitamin C enhances non-heme iron absorption by up to 6x.",

        tip: "Soak an iron tawa with water overnight and drink it — a traditional remedy."

      };

    }

    if (c.includes("acidity") || c.includes("gastritis") || c.includes("gerd")) {

      guidance["Acidity/GERD"] = {

        foods_to_eat: ["Banana, cold milk, coconut water", "Oats, rice, boiled vegetables", "Fennel seeds, cumin water, ajwain"],

        foods_to_avoid: ["Spicy food, citrus fruits on empty stomach", "Tea/coffee on empty stomach", "Carbonated drinks, fried foods"],

        reasoning: "Alkaline foods neutralize excess stomach acid. Small frequent meals prevent acid buildup.",

        tip: "Don't lie down immediately after eating. Keep a 2-hour gap before sleep."

      };

    }

  });

  return guidance;

}



function engineGenerateGroceryList(mealPlan, dietPref) {

  const categories = {

    "Grains & Cereals": [],

    "Pulses & Lentils": [],

    "Vegetables": [],

    "Fruits": [],

    "Dairy / Alternatives": [],

    "Proteins": [],

    "Spices & Condiments": [],

    "Oils & Fats": [],

    "Others": []

  };



  const veggies = ["Spinach", "Tomato", "Onion", "Cucumber", "Carrot", "Beetroot", "Capsicum", "Broccoli", "Potato", "Bottle gourd", "Bitter gourd", "Pumpkin", "Green peas"];

  const fruits = ["Banana", "Apple", "Orange", "Pomegranate", "Papaya", "Guava", "Watermelon", "Mango (seasonal)"];

  const grains = ["Rice", "Whole wheat flour (atta)", "Oats", "Poha", "Semolina (sooji)", "Brown rice"];

  const pulses = ["Moong dal", "Masoor dal", "Chana dal", "Rajma", "Chickpeas (chole)", "Black urad dal"];

  const spices = ["Turmeric", "Cumin", "Coriander powder", "Red chili powder", "Garam masala", "Mustard seeds", "Salt", "Black pepper"];



  categories["Vegetables"] = veggies.slice(0, 8);

  categories["Fruits"] = fruits.slice(0, 5);

  categories["Grains & Cereals"] = grains.slice(0, 4);

  categories["Pulses & Lentils"] = pulses.slice(0, 4);

  categories["Spices & Condiments"] = spices.slice(0, 6);

  categories["Oils & Fats"] = ["Mustard oil", "Olive oil / Groundnut oil"];



  if (dietPref === "Vegetarian") {

    categories["Dairy / Alternatives"] = ["Milk", "Curd", "Paneer", "Butter (small)"];

    categories["Proteins"] = ["Soybean chunks", "Tofu", "Peanuts", "Almonds"];

  } else if (dietPref === "Vegan") {

    categories["Dairy / Alternatives"] = ["Soy milk", "Coconut milk", "Almond milk"];

    categories["Proteins"] = ["Tofu", "Tempeh", "Peanut butter", "Mixed seeds"];

  } else {

    categories["Dairy / Alternatives"] = ["Milk", "Curd", "Paneer"];

    categories["Proteins"] = ["Eggs", "Chicken breast", "Fish (Rohu/Pomfret)", "Peanuts"];

  }

  categories["Others"] = ["Honey / Jaggery", "Green tea bags", "Flaxseeds", "Chia seeds"];



  return categories;

}



function engineGetFoodSwaps() {

  return [

    { unhealthy: "White rice", healthy: "Brown rice or quinoa", reason: "Brown rice has more fiber and nutrients, keeping you full longer", nutrientGain: "+3g fiber, +more B vitamins" },

    { unhealthy: "White bread", healthy: "Whole wheat roti or multigrain bread", reason: "Whole grains have a lower glycemic index and more nutrients", nutrientGain: "+4g fiber, +iron, +B vitamins" },

    { unhealthy: "Sugary cereal", healthy: "Oats with fruits", reason: "Oats provide slow-releasing energy and beta-glucan fiber", nutrientGain: "+5g fiber, -15g sugar" },

    { unhealthy: "Fried snacks (samosa, chips)", healthy: "Roasted makhana or baked snacks", reason: "Baking/roasting cuts down oil and calories significantly", nutrientGain: "-200 calories, -15g fat" },

    { unhealthy: "Sugary drinks / soda", healthy: "Coconut water or nimbu pani", reason: "Natural hydration without added sugar or artificial sweeteners", nutrientGain: "-30g sugar, +potassium" },

    { unhealthy: "Refined sugar", healthy: "Jaggery or honey (in moderation)", reason: "Jaggery has iron and minerals absent in refined sugar", nutrientGain: "+iron, +minerals" },

    { unhealthy: "Butter / cream", healthy: "Small amount of ghee or olive oil", reason: "Ghee has butyric acid for gut health; olive oil has heart-healthy fats", nutrientGain: "+healthy fats, -trans fats" },

    { unhealthy: "Packaged fruit juice", healthy: "Whole fruit or fresh smoothie", reason: "Whole fruits have fiber that juices lack; fiber slows sugar absorption", nutrientGain: "+3g fiber, -added sugars" },

    { unhealthy: "Maida (refined flour)", healthy: "Whole wheat or ragi flour", reason: "Whole grains retain bran and germ, rich in nutrients", nutrientGain: "+fiber, +iron, +calcium (ragi)" },

    { unhealthy: "Ice cream", healthy: "Frozen banana / fruit yogurt", reason: "Frozen banana has natural sweetness with potassium and fiber", nutrientGain: "-10g fat, +potassium, +fiber" },

  ];

}

function nutritionEngineProfile(p){
  const bmi = Number(p?.m?.bmi) || engineCalculateBMI(Number(p.weight), Number(p.height));
  return {
    age: Number(p.age),
    gender: p.gender,
    height_cm: Number(p.height),
    weight_kg: Number(p.weight),
    activity_level: p.activity,
    dietary_preference: p.diet,
    health_goal: p.goal,
    existing_conditions: (p.conditions||[]).filter(function(x){return x && x!=="None"}),
    bmi: bmi,
    bmi_category: Number(p.age) >= 18 ? engineGetBMICategory(bmi) : "Age-specific interpretation required"
  };
}
