import { lazy } from "react";
const Dashboard = lazy(() => import("./pages/Dashboard"));

//goal categories
const GoalCategories = lazy(() =>
  import("./pages/goal_categories/GoalCategories")
);
const ModifyGoalCategory = lazy(() =>
  import("./pages/goal_categories/ModifyGoalCategory")
);

//pre defined goals
const PreDefinedGoals = lazy(() =>
  import("./pages/pre_defined_goals/PreDefinedGoals")
);
const AddPreDefinedGoal = lazy(() =>
  import("./pages/pre_defined_goals/AddPreDefinedGoal")
);
const EditPreDefinedGoal = lazy(() =>
  import("./pages/pre_defined_goals/EditPreDefinedGoal")
);

//pre defined milestones
const ModifyPreDefinedMilestone = lazy(() =>
  import("./pages/pre_defined_milestones/ModifyPreDefinedMilestone")
);

//pre defined sub milestones
const PreDefinedSubMilestones = lazy(() =>
  import("./pages/pre_defined_sub_milestones/PreDefinedSubMilestones")
);

//qoute categories
const QouteCategories = lazy(() =>
  import("./pages/qoute_categories/QouteCategories")
);
const ModifyQouteCategory = lazy(() =>
  import("./pages/qoute_categories/ModifyQouteCategory")
);

//qoutations
const Qoutes = lazy(() => import("./pages/qoutations/Qoutes"));
const ModifyQoutes = lazy(() => import("./pages/qoutations/ModifyQoute"));

//affirmation categories
const AffirmationCategories = lazy(() =>
  import("./pages/affirmation_categories/AffirmationCategories")
);
const ModifyAffirmationCategory = lazy(() =>
  import("./pages/affirmation_categories/ModifyAffirmationCategory")
);

//affirmation categories
const AffirmationSubCategories = lazy(() =>
  import("./pages/affirmation_sub_categories/AffirmationSubCategories")
);
const ModifyAffirmationSubCategory = lazy(() =>
  import("./pages/affirmation_sub_categories/ModifyAffirmationSubCategory")
);

//affirmations
const Affirmations = lazy(() => import("./pages/affirmations/Affirmations"));
const ModifyAffirmations = lazy(() =>
  import("./pages/affirmations/ModifyAffirmation")
);

//ethnicities
const Ethnicities = lazy(() => import("./pages/ethnicities/Ethnicities"));
const ModifyEthnicity = lazy(() =>
  import("./pages/ethnicities/ModifyEthnicity")
);

//posts
const Posts = lazy(() => import("./pages/posts/Posts"));
const ModifyPost = lazy(() => import("./pages/posts/ModifyPost"));

//prayers
const Prayers = lazy(() => import("./pages/prayers/Prayers"));
const ModifyPrayer = lazy(() => import("./pages/prayers/ModifyPrayer"));

export const authenticatedRoutes = [
  //goal categories
  { path: "/goal_categories/:identifier", component: ModifyGoalCategory },
  { path: "/goal_categories", component: GoalCategories },

  //pre defined goals

  {
    path: "/pre_defined_goals/add",
    component: AddPreDefinedGoal,
  },
  {
    path: "/pre_defined_goals/:identifier",
    component: EditPreDefinedGoal,
  },
  {
    path: "/pre_defined_goals",
    component: PreDefinedGoals,
  },
  //pre defined milestones
  {
    path: "/pre_defined_milestones/:preDefinedGoal/:identifier",
    component: ModifyPreDefinedMilestone,
  },

  //pre defined sub milestones
  {
    path: "/pre_defined_sub_milestones/:identifier",
    component: PreDefinedSubMilestones,
  },
  //Qoute categories
  { path: "/qoute_categories/:identifier", component: ModifyQouteCategory },
  { path: "/qoute_categories", component: QouteCategories },
  //qoutations
  { path: "/qoutations/:identifier", component: ModifyQoutes },
  { path: "/qoutations", component: Qoutes },

  //Affirmation categories
  {
    path: "/affirmation_categories/:identifier",
    component: ModifyAffirmationCategory,
  },
  { path: "/affirmation_categories", component: AffirmationCategories },

  //Affirmation sub categories
  {
    path: "/affirmation_sub_categories/:identifier",
    component: ModifyAffirmationSubCategory,
  },
  { path: "/affirmation_sub_categories", component: AffirmationSubCategories },

  //Affirmations
  { path: "/affirmations/:identifier", component: ModifyAffirmations },
  { path: "/affirmations", component: Affirmations },

  //ethnicities
  { path: "/ethnicities/:identifier", component: ModifyEthnicity },
  { path: "/ethnicities", component: Ethnicities },

  //posts
  { path: "/posts/:identifier", component: ModifyPost },
  { path: "/posts", component: Posts },

  //prayers
  { path: "/prayers/:identifier", component: ModifyPrayer },
  { path: "/prayers", component: Prayers },
];
