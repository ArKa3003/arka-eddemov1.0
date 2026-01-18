/**
 * Animation Components
 *
 * Re-exports all animation utilities for easy importing.
 */

// Page Transitions
export {
  PageTransition,
  PageWrapper,
  RouteTransition,
  type PageTransitionProps,
  type PageWrapperProps,
  type RouteTransitionProps,
} from "./page-transition";

// Fade In Animations
export {
  FadeIn,
  FadeInGroup,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInOnScroll,
  type FadeInProps,
  type FadeInGroupProps,
  type FadeInOnScrollProps,
} from "./fade-in";

// Stagger Animations
export {
  StaggerChildren,
  StaggerItem,
  StaggerList,
  StaggerGrid,
  AnimatedList,
  type StaggerChildrenProps,
  type StaggerItemProps,
  type StaggerListProps,
  type StaggerGridProps,
  type AnimatedListProps,
} from "./stagger-children";

// Confetti
export {
  Confetti,
  useConfetti,
  SuccessConfetti,
  AchievementConfetti,
  PerfectScoreConfetti,
  type ConfettiProps,
} from "./confetti";
