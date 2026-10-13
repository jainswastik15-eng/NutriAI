/* ============================================================
   ORIGINAL BASE44 NUTRIAI MEAL DATABASE
   Added to V13 without changing the V13 page layout/styles.
   ============================================================ */
// NutriAI - Meal Database with Nutrient Info and Portions



function getBase44Meals(profile) {

  const { dietary_preference, health_goal, region, existing_conditions, budget_preference } = profile;

  const conditions = existing_conditions || [];





  const breakfasts = {

    "Vegetarian": {

      "North Indian": [

        { name: "Moong dal chilla with mint chutney", calories: 220, protein: 12, carbs: 28, fat: 6, fiber: 5, portion: "2 pieces + 2 tbsp chutney", nutrients: ["Iron", "Vitamin B6", "Folate", "Protein"], reason: "Moong dal is high in protein and easy to digest. Mint aids digestion." },

        { name: "Oats porridge with banana and almonds", calories: 280, protein: 9, carbs: 42, fat: 8, fiber: 6, portion: "1 bowl (200ml) + 1 banana + 4 almonds", nutrients: ["Fiber", "Potassium", "Vitamin E", "Magnesium"], reason: "Oats have beta-glucan fiber that lowers cholesterol and keeps you full." },

        { name: "Poha with peanuts and curry leaves", calories: 250, protein: 7, carbs: 38, fat: 8, fiber: 3, portion: "1 plate (150g)", nutrients: ["Iron", "Vitamin B1", "Healthy fats"], reason: "Poha is light, iron-fortified, and easy to digest. Peanuts add healthy fats." },

        { name: "Stuffed paratha (aloo/gobhi) with curd", calories: 320, protein: 10, carbs: 42, fat: 12, fiber: 4, portion: "2 parathas + 2 tbsp curd", nutrients: ["Carbohydrates", "Calcium", "Probiotics"], reason: "Provides sustained energy. Curd adds probiotics for gut health." },

        { name: "Upma with vegetables", calories: 230, protein: 7, carbs: 35, fat: 7, fiber: 4, portion: "1 cup (150g)", nutrients: ["Iron", "B vitamins", "Fiber"], reason: "Semolina gives quick energy, vegetables add vitamins and fiber." },

        { name: "Besan chilla with tomato and onion", calories: 200, protein: 11, carbs: 24, fat: 6, fiber: 5, portion: "2 pieces (150g)", nutrients: ["Protein", "Iron", "Folate", "Zinc"], reason: "Gram flour is protein-rich and gluten-free." },

        { name: "Ragi porridge with milk", calories: 240, protein: 8, carbs: 40, fat: 5, fiber: 5, portion: "1 bowl (200ml)", nutrients: ["Calcium", "Iron", "Fiber", "Amino acids"], reason: "Ragi is the richest cereal source of calcium, great for bone health." },

      ],

      "South Indian": [

        { name: "Idli with sambar and coconut chutney", calories: 250, protein: 9, carbs: 40, fat: 5, fiber: 4, portion: "3 idlis + 1 bowl sambar + 2 tbsp chutney", nutrients: ["Protein", "Iron", "B vitamins", "Probiotics"], reason: "Fermented batter improves nutrient absorption and gut health." },

        { name: "Dosa with sambar", calories: 270, protein: 8, carbs: 42, fat: 7, fiber: 3, portion: "1 dosa + 1 bowl sambar", nutrients: ["Iron", "Protein", "B vitamins"], reason: "Fermented rice-lentil batter provides balanced carbs and protein." },

        { name: "Pongal with coconut chutney", calories: 280, protein: 10, carbs: 38, fat: 9, fiber: 4, portion: "1 bowl (200g) + 2 tbsp chutney", nutrients: ["Protein", "Healthy fats", "B vitamins"], reason: "Rice and moong dal together make a complete protein source." },

        { name: "Uttapam with vegetables", calories: 240, protein: 8, carbs: 36, fat: 6, fiber: 4, portion: "1 piece (180g)", nutrients: ["Fiber", "Vitamins", "Protein"], reason: "Thick pancake base holds more vegetables, increasing nutrient density." },

        { name: "Upma with lemon and cashews", calories: 250, protein: 7, carbs: 38, fat: 8, fiber: 3, portion: "1 cup (150g)", nutrients: ["Vitamin C", "Iron", "Healthy fats"], reason: "Lemon's vitamin C enhances iron absorption from semolina." },

      ],

    },

    "Vegan": {

      "default": [

        { name: "Oats with soy milk and mixed berries", calories: 260, protein: 10, carbs: 40, fat: 7, fiber: 6, portion: "1 bowl (250ml) + ½ cup berries", nutrients: ["Fiber", "Antioxidants", "Plant protein", "Vitamin C"], reason: "Berries are rich in antioxidants, soy milk provides complete plant protein." },

        { name: "Vegetable poha with peanuts", calories: 240, protein: 8, carbs: 36, fat: 8, fiber: 4, portion: "1 cup (150g)", nutrients: ["Iron", "Healthy fats", "Vitamin B1"], reason: "Iron-fortified flattened rice with protein from peanuts." },

        { name: "Moong dal chilla with tomato chutney", calories: 210, protein: 12, carbs: 26, fat: 5, fiber: 5, portion: "2 pieces (150g) + 2 tbsp chutney", nutrients: ["Protein", "Folate", "Iron"], reason: "Excellent plant protein source, easy to digest." },

        { name: "Ragi dosa with coconut chutney", calories: 230, protein: 7, carbs: 38, fat: 6, fiber: 5, portion: "2 pieces + 2 tbsp chutney", nutrients: ["Calcium", "Iron", "Fiber"], reason: "Ragi provides more calcium than any other cereal." },

        { name: "Sprouts salad with lemon dressing", calories: 180, protein: 10, carbs: 22, fat: 4, fiber: 6, portion: "1 bowl (150g)", nutrients: ["Protein", "Vitamin C", "Iron", "Enzymes"], reason: "Sprouting increases nutrient availability by 300-500%." },

        { name: "Upma with mixed vegetables", calories: 220, protein: 7, carbs: 34, fat: 6, fiber: 4, portion: "1 cup (150g)", nutrients: ["Iron", "B vitamins", "Fiber"], reason: "Semolina with vegetables provides balanced morning nutrition." },

      ]

    },

    "Non-Vegetarian": {

      "default": [

        { name: "Egg bhurji with whole wheat toast", calories: 300, protein: 18, carbs: 25, fat: 14, fiber: 3, portion: "2 eggs + 2 toast slices", nutrients: ["Protein", "Vitamin D", "Choline", "B12"], reason: "Eggs provide complete protein and choline for brain health." },

        { name: "Boiled eggs (2) with multigrain bread", calories: 280, protein: 16, carbs: 28, fat: 10, fiber: 4, portion: "2 eggs + 2 bread slices", nutrients: ["Protein", "Vitamin D", "B12", "Selenium"], reason: "Boiling preserves nutrients without adding extra fat." },

        { name: "Omelette with vegetables and toast", calories: 290, protein: 17, carbs: 22, fat: 14, fiber: 3, portion: "2 egg omelette + 2 toast slices", nutrients: ["Protein", "Vitamins A/D", "Iron", "B12"], reason: "Vegetable omelette combines protein with vital micronutrients." },

        { name: "Poha with peanuts and boiled egg", calories: 310, protein: 15, carbs: 38, fat: 10, fiber: 4, portion: "1 cup poha (120g) + 1 boiled egg", nutrients: ["Iron", "Protein", "B vitamins", "Healthy fats"], reason: "A balanced combo of carbs, protein, and micronutrients." },

        { name: "Chicken sandwich with veggies (whole wheat)", calories: 320, protein: 22, carbs: 30, fat: 12, fiber: 4, portion: "1 sandwich (200g)", nutrients: ["Protein", "Iron", "B vitamins", "Fiber"], reason: "Lean chicken provides high-quality protein for muscle maintenance." },

      ]

    }

  };



  const lunches = {

    "Vegetarian": {

      "North Indian": [

        { name: "Dal (masoor/moong), roti, sabzi, salad", calories: 420, protein: 16, carbs: 55, fat: 12, fiber: 8, portion: "2 rotis + 1 bowl dal + 1 bowl sabzi + small salad", nutrients: ["Protein", "Iron", "Fiber", "Vitamin A/C"], reason: "Traditional balanced meal — dal provides protein, roti gives energy, sabzi adds vitamins." },

        { name: "Rajma chawal with raita", calories: 450, protein: 15, carbs: 62, fat: 12, fiber: 9, portion: "¾ cup rice + 1 bowl rajma + ¼ cup raita", nutrients: ["Protein", "Iron", "Calcium", "Fiber"], reason: "Rajma + rice = complete protein. Raita adds calcium and probiotics." },

        { name: "Chole with rice and cucumber salad", calories: 440, protein: 14, carbs: 58, fat: 14, fiber: 8, portion: "¾ cup rice + 1 bowl chole + cucumber salad", nutrients: ["Protein", "Iron", "Folate", "Fiber"], reason: "Chickpeas are protein-dense and high in fiber for digestive health." },

        { name: "Paneer sabzi with roti and dal", calories: 460, protein: 20, carbs: 48, fat: 18, fiber: 6, portion: "2 rotis + 1 bowl paneer sabzi + ½ bowl dal", nutrients: ["Protein", "Calcium", "Iron", "B vitamins"], reason: "Paneer provides calcium and protein; combined with dal for complete amino acids." },

        { name: "Kadhi with rice and aloo sabzi", calories: 400, protein: 12, carbs: 56, fat: 14, fiber: 5, portion: "¾ cup rice + 1 bowl kadhi + 1 bowl sabzi", nutrients: ["Probiotics", "Protein", "Potassium", "Vitamin C"], reason: "Kadhi's curd base provides probiotics for gut health." },

      ],

      "South Indian": [

        { name: "Sambar rice with papad and pickle", calories: 400, protein: 12, carbs: 60, fat: 10, fiber: 7, portion: "¾ cup rice + 1 bowl sambar + 1 papad", nutrients: ["Protein", "Iron", "Fiber", "Vitamins"], reason: "Sambar's lentils and vegetables make it nutrient-dense." },

        { name: "Rasam rice with curd and banana", calories: 380, protein: 10, carbs: 58, fat: 8, fiber: 5, portion: "¾ cup rice + 1 bowl rasam + ¼ cup curd + 1 small banana", nutrients: ["Vitamin C", "Potassium", "Probiotics", "Iron"], reason: "Rasam's tamarind and tomato are rich in vitamin C and aid digestion." },

        { name: "Thali: rice, sambar, rasam, poriyal, curd", calories: 480, protein: 15, carbs: 65, fat: 12, fiber: 8, portion: "¾ cup rice + 1 bowl sambar + small rasam + poriyal + curd", nutrients: ["Balanced macro/micro nutrients"], reason: "South Indian thali covers all food groups for complete nutrition." },

      ],

    },

    "Vegan": {

      "default": [

        { name: "Dal, brown rice, mixed vegetable sabzi", calories: 420, protein: 15, carbs: 58, fat: 10, fiber: 9, portion: "¾ cup rice + 1 bowl dal + 1 bowl sabzi", nutrients: ["Protein", "Iron", "Fiber", "Vitamins A/C"], reason: "Brown rice retains bran layer with extra fiber, iron, and B vitamins." },

        { name: "Chole with roti and salad", calories: 430, protein: 14, carbs: 55, fat: 13, fiber: 9, portion: "2 rotis + 1 bowl chole + salad", nutrients: ["Protein", "Iron", "Folate", "Fiber"], reason: "Chickpeas provide protein, iron, and soluble fiber." },

        { name: "Rajma with rice and tomato salad", calories: 440, protein: 15, carbs: 60, fat: 11, fiber: 10, portion: "¾ cup rice + 1 bowl rajma + tomato salad", nutrients: ["Protein", "Iron", "Potassium", "Fiber"], reason: "Kidney beans + rice form a complete protein combination." },

        { name: "Mixed vegetable pulao with raita (soy curd)", calories: 380, protein: 11, carbs: 52, fat: 12, fiber: 6, portion: "1 cup pulao (200g) + ¼ cup soy raita", nutrients: ["Vitamins", "Fiber", "Plant protein"], reason: "Variety of vegetables ensures diverse micronutrient intake." },

        { name: "Tofu stir-fry with roti and dal", calories: 400, protein: 18, carbs: 45, fat: 14, fiber: 7, portion: "100g tofu + 2 rotis + ½ bowl dal", nutrients: ["Protein", "Calcium", "Iron", "Isoflavones"], reason: "Tofu provides calcium and complete plant protein." },

      ]

    },

    "Non-Vegetarian": {

      "default": [

        { name: "Chicken curry with rice and salad", calories: 480, protein: 28, carbs: 50, fat: 16, fiber: 5, portion: "¾ cup rice + 1 bowl chicken curry + salad", nutrients: ["Protein", "Iron", "B12", "Zinc"], reason: "Chicken is lean protein, rice provides energy, salad adds vitamins." },

        { name: "Fish curry (rohu/pomfret) with rice and dal", calories: 460, protein: 26, carbs: 52, fat: 14, fiber: 6, portion: "¾ cup rice + 1 bowl fish curry + ½ bowl dal", nutrients: ["Omega-3", "Protein", "Vitamin D", "Iron"], reason: "Fish provides omega-3 fatty acids essential for heart and brain health." },

        { name: "Egg curry with roti and sabzi", calories: 420, protein: 20, carbs: 45, fat: 16, fiber: 5, portion: "2 rotis + 1 bowl egg curry + 1 bowl sabzi", nutrients: ["Protein", "B12", "Vitamin D", "Iron"], reason: "Eggs offer complete protein and essential B12 and Vitamin D." },

        { name: "Dal, chicken tikka (2 pcs), roti, salad", calories: 470, protein: 30, carbs: 42, fat: 18, fiber: 6, portion: "2 rotis + 2 tikka pieces + ½ bowl dal + salad", nutrients: ["Protein", "Iron", "Zinc", "B vitamins"], reason: "Tandoori cooking retains protein without excess oil." },

        { name: "Mutton (small portion) with rice and raita", calories: 500, protein: 25, carbs: 50, fat: 20, fiber: 4, portion: "¾ cup rice + ½ bowl mutton + ¼ cup raita", nutrients: ["Protein", "Iron", "Zinc", "B12"], reason: "Red meat in small portions provides iron and B12 efficiently." },

      ]

    }

  };



  const dinners = {

    "Vegetarian": {

      "North Indian": [

        { name: "Khichdi with curd and papad", calories: 350, protein: 12, carbs: 50, fat: 8, fiber: 6, portion: "1 bowl (250g) + 2 tbsp curd + 1 papad", nutrients: ["Protein", "Probiotics", "Easy-to-digest carbs"], reason: "Khichdi is the easiest to digest, perfect for dinner. Curd adds probiotics." },

        { name: "Roti with palak paneer and salad", calories: 380, protein: 16, carbs: 38, fat: 16, fiber: 6, portion: "2 rotis + 1 bowl palak paneer + small salad", nutrients: ["Calcium", "Iron", "Protein", "Vitamin A"], reason: "Spinach provides iron and vitamin A; paneer adds calcium and protein." },

        { name: "Moong dal with roti and mixed veg", calories: 360, protein: 14, carbs: 48, fat: 10, fiber: 7, portion: "2 rotis + 1 bowl moong dal + 1 bowl sabzi", nutrients: ["Protein", "Fiber", "Iron", "B vitamins"], reason: "Light yet nutritious. Moong dal is easiest to digest among pulses." },

        { name: "Vegetable soup with multigrain toast", calories: 250, protein: 8, carbs: 32, fat: 7, fiber: 6, portion: "1 bowl soup (250ml) + 2 toast slices", nutrients: ["Vitamins A/C", "Fiber", "Antioxidants"], reason: "Light dinner aids better sleep and digestion. Rich in antioxidants." },

        { name: "Dalia (broken wheat) khichdi with raita", calories: 300, protein: 11, carbs: 45, fat: 7, fiber: 8, portion: "1 bowl (250g) + 2 tbsp raita", nutrients: ["Fiber", "Protein", "B vitamins", "Iron"], reason: "Dalia has a low glycemic index, ideal for sustained energy without spikes." },

      ],

      "South Indian": [

        { name: "Idli (2) with sambar", calories: 250, protein: 9, carbs: 40, fat: 4, fiber: 4, portion: "2 idlis + 1 bowl sambar", nutrients: ["Protein", "Probiotics", "Iron"], reason: "Light fermented dinner, easy on the stomach for good sleep." },

        { name: "Vegetable uttapam with coconut chutney", calories: 280, protein: 8, carbs: 38, fat: 9, fiber: 4, portion: "1 piece + 2 tbsp coconut chutney", nutrients: ["Fiber", "Vitamins", "Healthy fats"], reason: "Coconut provides medium-chain fatty acids; fermented base aids digestion." },

        { name: "Pesarattu (green gram dosa) with ginger chutney", calories: 240, protein: 11, carbs: 32, fat: 6, fiber: 5, portion: "2 pieces + 2 tbsp chutney", nutrients: ["Protein", "Iron", "Fiber", "Vitamin C"], reason: "Green gram is protein-rich and lighter than rice-based dosas." },

      ],

    },

    "Vegan": {

      "default": [

        { name: "Vegetable khichdi with lemon", calories: 320, protein: 11, carbs: 48, fat: 7, fiber: 6, portion: "1 bowl (250g) + squeeze of lemon", nutrients: ["Protein", "Fiber", "Vitamin C", "Iron"], reason: "Easy to digest; lemon enhances iron absorption." },

        { name: "Roti with dal and mixed veg", calories: 360, protein: 14, carbs: 48, fat: 10, fiber: 7, portion: "2 rotis + 1 bowl dal + 1 bowl sabzi", nutrients: ["Protein", "Iron", "Fiber", "B vitamins"], reason: "Complete balanced dinner with all macronutrients." },

        { name: "Tofu and vegetable stir-fry with brown rice", calories: 350, protein: 16, carbs: 42, fat: 12, fiber: 6, portion: "100g tofu + 1 cup stir-fry veg + ¾ cup rice", nutrients: ["Protein", "Calcium", "Fiber", "Iron"], reason: "Tofu provides essential amino acids and calcium for vegans." },

        { name: "Mixed vegetable soup with bread", calories: 220, protein: 7, carbs: 30, fat: 6, fiber: 5, portion: "1 bowl soup (250ml) + 2 bread slices", nutrients: ["Vitamins", "Fiber", "Antioxidants"], reason: "Warm soup is soothing and easy to digest before sleep." },

      ]

    },

    "Non-Vegetarian": {

      "default": [

        { name: "Grilled chicken with roti and salad", calories: 380, protein: 28, carbs: 30, fat: 14, fiber: 4, portion: "100g grilled chicken + 2 rotis + salad", nutrients: ["Protein", "Iron", "Zinc", "B vitamins"], reason: "Grilling preserves protein without adding excess fat." },

        { name: "Fish tikka with vegetable soup", calories: 320, protein: 24, carbs: 18, fat: 14, fiber: 4, portion: "100g fish tikka + 1 bowl soup", nutrients: ["Omega-3", "Protein", "Vitamin D"], reason: "Fish provides omega-3 for brain health; light dinner aids sleep." },

        { name: "Egg curry (2 eggs) with roti", calories: 350, protein: 18, carbs: 32, fat: 14, fiber: 3, portion: "2 rotis + 2 egg curry", nutrients: ["Protein", "B12", "Vitamin D", "Choline"], reason: "Eggs are one of the most nutrient-dense foods available." },

        { name: "Dal with grilled chicken pieces and salad", calories: 400, protein: 30, carbs: 35, fat: 14, fiber: 6, portion: "½ bowl dal + 80g chicken + salad", nutrients: ["Protein", "Iron", "Fiber", "B vitamins"], reason: "High-protein dinner supports overnight muscle recovery." },

      ]

    }

  };



  const snacks = {

    "Vegetarian": [

      { name: "Roasted makhana (fox nuts)", calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 2, portion: "¾ cup (30g)", nutrients: ["Calcium", "Phosphorus", "Low GI"], reason: "Low-calorie, high-calcium snack. Good for weight management." },

      { name: "Fruit bowl (apple, banana, papaya)", calories: 150, protein: 2, carbs: 35, fat: 1, fiber: 4, portion: "1 bowl (150g)", nutrients: ["Vitamin C", "Potassium", "Fiber", "Antioxidants"], reason: "Seasonal fruits provide natural vitamins without processed sugar." },

      { name: "Curd with flaxseeds", calories: 130, protein: 6, carbs: 12, fat: 6, fiber: 3, portion: "½ cup curd + 1 tsp flaxseeds", nutrients: ["Probiotics", "Omega-3", "Calcium", "Protein"], reason: "Probiotics support gut health; flaxseeds add omega-3 fatty acids." },

      { name: "Handful of mixed nuts (almonds, walnuts)", calories: 180, protein: 6, carbs: 8, fat: 16, fiber: 3, portion: "1 small handful (25g)", nutrients: ["Vitamin E", "Omega-3", "Magnesium", "Healthy fats"], reason: "Nuts provide healthy fats and vitamin E for skin and brain health." },

      { name: "Sprouts chaat with lemon", calories: 140, protein: 8, carbs: 20, fat: 2, fiber: 5, portion: "1 bowl (100g)", nutrients: ["Protein", "Vitamin C", "Iron", "Folate"], reason: "Sprouting increases protein and makes nutrients more bioavailable." },

      { name: "Buttermilk (chaas)", calories: 60, protein: 3, carbs: 5, fat: 2, fiber: 0, portion: "1 glass (200ml)", nutrients: ["Probiotics", "Calcium", "B12", "Hydration"], reason: "Excellent for digestion and hydration, especially in summer." },

      { name: "Peanut chikki (small piece)", calories: 160, protein: 5, carbs: 18, fat: 8, fiber: 2, portion: "1 small piece (30g)", nutrients: ["Protein", "Iron", "Healthy fats"], reason: "Jaggery provides iron, peanuts add protein — healthier than candy." },

    ],

    "Vegan": [

      { name: "Mixed nuts and seeds", calories: 180, protein: 6, carbs: 8, fat: 16, fiber: 3, portion: "1 small handful (25g)", nutrients: ["Omega-3", "Vitamin E", "Magnesium"], reason: "Essential fatty acids for brain health and inflammation control." },

      { name: "Fruit with peanut butter", calories: 200, protein: 6, carbs: 28, fat: 9, fiber: 4, portion: "1 medium fruit + 1 tbsp peanut butter", nutrients: ["Healthy fats", "Potassium", "Vitamin C", "Protein"], reason: "Combination of quick and sustained energy." },

      { name: "Roasted chickpeas", calories: 140, protein: 7, carbs: 22, fat: 3, fiber: 5, portion: "¼ cup (40g)", nutrients: ["Protein", "Iron", "Fiber", "Folate"], reason: "Crunchy, high-fiber alternative to fried snacks." },

      { name: "Coconut water", calories: 45, protein: 1, carbs: 9, fat: 0, fiber: 1, portion: "1 glass (250ml)", nutrients: ["Potassium", "Electrolytes", "Hydration"], reason: "Natural electrolyte drink, better than sports drinks." },

      { name: "Sprouts salad", calories: 130, protein: 8, carbs: 18, fat: 2, fiber: 5, portion: "1 bowl (100g)", nutrients: ["Protein", "Vitamin C", "Iron", "Enzymes"], reason: "Living food with maximum nutrient density." },

    ],

    "Non-Vegetarian": [

      { name: "Boiled egg (1)", calories: 80, protein: 6, carbs: 1, fat: 5, fiber: 0, portion: "1 whole egg", nutrients: ["Protein", "B12", "Vitamin D", "Choline"], reason: "Complete protein snack with brain-boosting choline." },

      { name: "Roasted makhana", calories: 120, protein: 4, carbs: 18, fat: 3, fiber: 2, portion: "¾ cup (30g)", nutrients: ["Calcium", "Phosphorus", "Low calories"], reason: "Light, crunchy, and filling without excess calories." },

      { name: "Mixed nuts and dried fruits", calories: 180, protein: 5, carbs: 16, fat: 12, fiber: 3, portion: "1 small handful (25g)", nutrients: ["Vitamin E", "Iron", "Healthy fats"], reason: "Quick energy with essential micronutrients." },

      { name: "Fruit bowl", calories: 140, protein: 2, carbs: 32, fat: 1, fiber: 4, portion: "1 bowl (150g)", nutrients: ["Vitamin C", "Fiber", "Potassium", "Antioxidants"], reason: "Natural vitamins and hydration from seasonal fruits." },

      { name: "Chicken tikka (2 small pieces)", calories: 150, protein: 18, carbs: 4, fat: 7, fiber: 1, portion: "2 small pieces (80g)", nutrients: ["Protein", "Iron", "Zinc", "B12"], reason: "High-protein, low-carb snack for muscle support." },

    ]

  };



  const normalizeCondition = (c) => {
    const s = String(c || "").toLowerCase();
    if (s.includes("diabet")) return "Diabetes";
    if (s.includes("hypertension") || s.includes("blood pressure") || s.includes("high bp") || s === "bp") return "Hypertension / High BP";
    if (s.includes("cholesterol")) return "High Cholesterol";
    if (s.includes("anemia") || s.includes("anaemia")) return "Anemia";
    if (s.includes("thyroid")) return "Thyroid";
    if (s.includes("pcos") || s.includes("pcod")) return "PCOS/PCOD";
    if (s.includes("gerd") || s.includes("acidity") || s.includes("gastritis") || s.includes("reflux")) return "Acidity/GERD";
    return c;
  };

  const activeConditions = [...new Set(
    conditions
      .filter(c => c && String(c).toLowerCase() !== "none")
      .map(normalizeCondition)
  )];

  // This scorer only uses information actually present in the local meal database
  // (meal name, macros, fiber and nutrient tags). It does NOT claim medical safety.
  const conditionScore = (meal, condition) => {
    const name = String(meal.name || "").toLowerCase();
    const nutrients = (meal.nutrients || []).join(" ").toLowerCase();
    const text = name + " " + nutrients;
    let score = 0;
    const reasons = [];

    const add = (points, reason) => {
      score += points;
      if (reason && !reasons.includes(reason)) reasons.push(reason);
    };
    const hasAny = (words) => words.some(w => text.includes(w));

    if (condition === "Diabetes") {
      if ((meal.fiber || 0) >= 5) add(5, "higher-fiber choice");
      if ((meal.protein || 0) >= 10) add(3, "includes useful protein");
      if (hasAny(["oats","ragi","moong","besan","sprout","dal","lentil","tofu","paneer","vegetable"])) add(4, "prioritizes fiber/protein-rich foods");
      if ((meal.carbs || 0) > 48) add(-5);
      if (hasAny(["paratha","aloo","white bread","sugar","sweet"])) add(-4);
    }

    if (condition === "Hypertension / High BP") {
      if (hasAny(["vegetable","spinach","palak","dal","lentil","oats","fruit","guava","banana","sprout","tofu"])) add(4, "emphasizes minimally processed plant foods");
      if ((meal.fiber || 0) >= 4) add(2, "adds fiber-rich foods");
      if (hasAny(["pickle","papad","salted","processed"])) add(-6);
      // Sodium values are not available, so never call a meal "low sodium".
    }

    if (condition === "High Cholesterol") {
      if (hasAny(["oats","barley","dal","lentil","rajma","chickpea","chole","sprout","tofu","vegetable","nuts","almond","walnut","flax"])) add(5, "emphasizes soluble-fiber/plant-protein foods");
      if ((meal.fiber || 0) >= 5) add(4, "higher in fiber");
      if (hasAny(["fried","butter","ghee","cream"])) add(-5);
    }

    if (condition === "Anemia") {
      if (hasAny(["spinach","palak","methi","lentil","dal","rajma","chickpea","chole","sprout","sesame","iron","egg","chicken"])) add(5, "includes iron-containing foods");
      if (hasAny(["lemon","amla","guava","orange","tomato","vitamin c"])) add(3, "includes vitamin-C-containing foods");
      if ((meal.protein || 0) >= 10) add(2, "includes useful protein");
    }

    if (condition === "Thyroid") {
      if ((meal.protein || 0) >= 10) add(3, "supports a balanced protein-containing meal");
      if (hasAny(["egg","milk","curd","yogurt","dal","lentil","tofu","paneer","nuts","seed"])) add(3, "adds varied protein/micronutrient sources");
      if ((meal.fiber || 0) >= 4) add(1, "keeps the meal balanced");
      // Thyroid conditions differ, so there are no blanket food bans here.
    }

    if (condition === "PCOS/PCOD") {
      if ((meal.fiber || 0) >= 5) add(5, "higher-fiber option");
      if ((meal.protein || 0) >= 10) add(4, "includes useful protein");
      if (hasAny(["oats","ragi","moong","besan","sprout","dal","lentil","tofu","paneer","vegetable"])) add(4, "prioritizes fiber/protein-rich foods");
      if (hasAny(["sugar","sweet","refined","white bread"])) add(-5);
    }

    if (condition === "Acidity/GERD") {
      if (hasAny(["oats","idli","moong","dal","rice","vegetable","banana","curd"])) add(3, "uses a relatively simple meal pattern");
      if (hasAny(["chilli","chili","spicy","fried","pickle"])) add(-5);
      // Individual reflux triggers vary; this is only a gentle ranking preference.
    }

    return {score, reasons};
  };

  const rankForProfile = (meals) => {
    const source = Array.isArray(meals) ? meals : [];
    if (!activeConditions.length) return source;

    return source
      .map((meal, index) => {
        let total = 0;
        let reasons = [];

        activeConditions.forEach(condition => {
          const result = conditionScore(meal, condition);
          total += result.score;
          reasons = reasons.concat(result.reasons);
        });

        // Small general tie-breakers so a condition-aware ranking remains balanced.
        if ((meal.protein || 0) >= 10) total += 1;
        if ((meal.fiber || 0) >= 4) total += 1;

        return {
          ...meal,
          _originalIndex: index,
          diseaseFitScore: total,
          personalizationNote: [...new Set(reasons)].slice(0, 3).join(", ")
        };
      })
      .sort((a,b) => (b.diseaseFitScore - a.diseaseFitScore) || (a._originalIndex - b._originalIndex));
  };



  const getRegionMeals = (mealType, diet) => {

    const regionKey = (region && mealType[diet]?.[region]) ? region : "default";

    const northKey = "North Indian";

    if (mealType[diet]?.[regionKey]) return mealType[diet][regionKey];

    if (mealType[diet]?.[northKey]) return mealType[diet][northKey];

    if (mealType[diet]?.["default"]) return mealType[diet]["default"];

    return mealType["Vegetarian"]?.[northKey] || mealType["Vegetarian"]?.["default"] || [];

  };



  return {

    breakfasts: rankForProfile(getRegionMeals(breakfasts, dietary_preference)),

    lunches: rankForProfile(getRegionMeals(lunches, dietary_preference)),

    dinners: rankForProfile(getRegionMeals(dinners, dietary_preference)),

    snacks: rankForProfile(snacks[dietary_preference] || snacks["Vegetarian"]),

  };

}
