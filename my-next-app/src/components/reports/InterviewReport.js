import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
export const dynamic = "force-dynamic";

/**
 * Interview Report PDF Generator
 *
 * Professional PDF report generator for technical interview assessments.
 * Features include candidate information, skills assessment, question tracking,
 * and detailed evaluation sections with standardized rating systems.
 *
 * @author Your Organization
 * @version 1.0.0
 */

// Register fonts with complete fallback system
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

// Define a comprehensive color system for consistent UI
const COLORS = {
  primary: {
    main: "#1565C0", // Deeper blue for more professional look
    light: "#1E88E5",
    dark: "#0D47A1",
    contrast: "#FFFFFF",
  },
  secondary: {
    main: "#424242",
    light: "#616161",
    dark: "#212121",
    contrast: "#FFFFFF",
  },
  success: {
    main: "#2E7D32", // Darker green for better readability
    light: "#4CAF50",
    dark: "#1B5E20",
    contrast: "#FFFFFF",
  },
  warning: {
    main: "#F57F17", // Darker orange for better readability
    light: "#FFA000",
    dark: "#E65100",
    contrast: "#FFFFFF",
  },
  danger: {
    main: "#C62828", // Darker red for better readability
    light: "#EF5350",
    dark: "#B71C1C",
    contrast: "#FFFFFF",
  },
  neutral: {
    main: "#F5F5F5",
    light: "#FAFAFA",
    dark: "#E0E0E0",
    darker: "#9E9E9E",
    text: {
      primary: "#212121",
      secondary: "#616161",
      disabled: "#9E9E9E",
    },
  },
  background: {
    default: "#FFFFFF",
    paper: "#F5F5F5",
    accent: "#F9FAFC",
  },
  divider: "#E0E0E0",
};

// Create more organized styles with proper grouping
const styles = StyleSheet.create({
  // Layout styles
  page: {
    flexDirection: "column",
    backgroundColor: COLORS.background.default,
    padding: 30,
    fontFamily: "Roboto",
    fontSize: 10,
    color: COLORS.neutral.text.primary,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  spacer: {
    height: 15,
  },

  // Header styles
  header: {
    backgroundColor: COLORS.primary.main,
    padding: 20,
    marginBottom: 25,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.primary.contrast,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primary.contrast,
    opacity: 0.9,
  },
  logoContainer: {
    width: 120,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: COLORS.primary.contrast,
    fontSize: 8,
    textAlign: "center",
  },

  // Section styles
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: COLORS.background.paper,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.main,
    borderLeftStyle: "solid",
  },
  evaluationSection: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: COLORS.background.paper,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.light,
    borderLeftStyle: "solid",
  },

  // Candidate info styles
  candidateSection: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: COLORS.background.paper,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  candidateInfo: {
    flex: 3,
    padding: 15,
  },
  candidateMetrics: {
    flex: 2,
    backgroundColor: COLORS.primary.main,
    padding: 15,
    color: COLORS.primary.contrast,
  },
  decisionBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },

  // Typography styles
  title: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: COLORS.primary.main,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    borderBottomStyle: "solid",
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: COLORS.secondary.main,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginVertical: 8,
    color: COLORS.secondary.main,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    color: COLORS.neutral.text.primary,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 10,
    color: COLORS.neutral.text.secondary,
    width: 120,
    fontWeight: 500,
  },
  value: {
    fontSize: 11,
    fontWeight: 500,
    flex: 1,
    color: COLORS.neutral.text.primary,
  },
  whiteText: {
    color: COLORS.primary.contrast,
  },
  decisionText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 700,
    color: COLORS.primary.contrast,
  },

  // Rating visualization
  skillRatingsContainer: {
    marginVertical: 15,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skillLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.secondary.main,
  },
  skillBar: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.neutral.light,
    borderRadius: 5,
    overflow: "hidden",
  },
  skillFill: {
    height: "100%",
    borderRadius: 5,
  },
  skillValue: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.primary.main,
    width: 30,
    textAlign: "right",
  },

  // Questions section
  questionCategory: {
    marginBottom: 12,
  },
  question: {
    fontSize: 10,
    marginLeft: 15,
    marginVertical: 4,
    color: COLORS.neutral.text.primary,
    position: "relative",
  },
  bulletPoint: {
    position: "absolute",
    left: -10,
    top: 4,
    width: 5,
    height: 5,
    backgroundColor: COLORS.primary.light,
    borderRadius: 3,
  },

  // Evaluation sections
  evaluationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  evaluationBadge: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: COLORS.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  evaluationNumber: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.primary.contrast,
  },
  evaluationTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.secondary.main,
  },
  ratingDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ratingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  ratingDisplayValue: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.primary.contrast,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.neutral.text.primary,
    fontWeight: 500,
  },

  // Rating options
  ratingOptionsContainer: {
    marginVertical: 10,
    backgroundColor: COLORS.background.accent,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral.darker,
    borderRadius: 3,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: COLORS.primary.light,
    borderColor: COLORS.primary.light,
  },
  checkmark: {
    color: COLORS.primary.contrast,
    fontSize: 8,
    fontWeight: 700,
  },
  optionText: {
    fontSize: 9,
    flex: 1,
    color: COLORS.neutral.text.primary,
    lineHeight: 1.4,
  },

  // Rating legend
  ratingLegend: {
    flexDirection: "row",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  ratingLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  ratingLegendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },

  // Strengths and improvements
  feedbackSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.background.accent,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    color: COLORS.secondary.main,
  },
  bulletItem: {
    flexDirection: "row",
    marginVertical: 3,
    alignItems: "flex-start",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
    color: COLORS.neutral.text.primary,
  },
  strengthsBullet: {
    color: COLORS.success.main,
    fontWeight: 700,
    fontSize: 10,
    marginRight: 5,
    marginTop: -2,
  },
  improvementBullet: {
    color: COLORS.warning.main,
    fontWeight: 700,
    fontSize: 10,
    marginRight: 5,
    marginTop: -2,
  },

  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: COLORS.neutral.text.secondary,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageNumber: {
    fontSize: 8,
    color: COLORS.neutral.text.secondary,
  },
  timestamp: {
    fontSize: 8,
    color: COLORS.neutral.text.secondary,
    marginRight: 10,
  },
});

/**
 * Helper function to get color based on rating
 * @param {number} rating - The numerical rating
 * @returns {string} The appropriate color from the COLORS system
 */
const getRatingColor = (rating) => {
  if (rating >= 8) return COLORS.success.main;
  if (rating >= 6) return COLORS.primary.light;
  if (rating >= 4) return COLORS.warning.main;
  return COLORS.danger.main;
};

/**
 * Helper function to determine rating text based on score
 * @param {number} rating - The numerical rating
 * @returns {string} The verbal representation of the rating
 */
const getRatingText = (rating) => {
  if (rating >= 8) return "Strong yes";
  if (rating >= 6) return "Yes";
  if (rating >= 4) return "No";
  return "Strong no";
};

/**
 * Creates rating options based on section and rating
 * @param {string} section - The section name
 * @param {number} rating - The rating value
 * @returns {Array} Array of rating options with selected status
 */
const getRatingOptions = (section, rating) => {
  // Rating options by skill category
  const ratingOptionsBySkill = {
    // HTML/CSS rating options
    html_css: [
      "Strong command of HTML/CSS fundamentals with extensive practical experience. Demonstrates proper usage of semantic HTML and CSS best practices.",
      "Good understanding of HTML/CSS fundamentals with adequate practical experience. May require occasional guidance for complex implementations.",
      "Basic theoretical knowledge of HTML/CSS but limited practical experience. Requires significant guidance for implementation.",
      "Insufficient knowledge of HTML/CSS fundamentals for the position requirements.",
    ],
    // JavaScript rating options
    javascript: [
      "Advanced knowledge of JavaScript including ES6+ features. Demonstrates strong understanding of asynchronous programming, closures, and design patterns with relevant practical examples.",
      "Solid knowledge of JavaScript fundamentals with some understanding of modern features. Can implement practical solutions with occasional guidance.",
      "Basic theoretical knowledge of JavaScript but struggles with practical implementation. Limited understanding of advanced concepts.",
      "Insufficient knowledge of JavaScript fundamentals for the position requirements.",
    ],
    // TypeScript rating options
    typescript: [
      "Extensive knowledge of TypeScript including advanced typing, generics, and utility types. Consistently applies best practices for type safety.",
      "Good understanding of TypeScript fundamentals and commonly used features. Creates proper interfaces and uses type annotations appropriately.",
      "Basic knowledge of TypeScript with limited experience in practical implementation. Needs guidance for proper type definitions.",
      "Minimal understanding of TypeScript concepts and benefits. Struggles with basic type annotations.",
    ],
    // React Core rating options
    react: [
      "Strong knowledge of React core concepts and knows practical application of most of them.",
      "Good knowledge of React core concepts and knows practical application of some of them after giving some hints.",
      "Only theoretical knowledge of some of the react core concepts with no practical exposure.",
      "No knowledge of React core concepts.",
    ],
    // React Advanced rating options
    react_advanced: [
      "Strong knowledge of concepts like portals, fragments & other concepts with good practical examples.",
      "Good knowledge of concepts like portals, fragments & other concepts with good practical examples after some hand-holding.",
      "Only theoretical knowledge of concepts like portals & other concepts but no practical experience.",
      "No knowledge of portals or fragments.",
    ],
    // Angular rating options
    angular: [
      "Expert in Angular framework with deep understanding of reactivity, services, and dependency injection. Implements advanced patterns and optimizations.",
      "Solid understanding of Angular core concepts and structure. Can create robust applications with appropriate architecture.",
      "Basic familiarity with Angular components and templates but limited experience with advanced features.",
      "Minimal knowledge of Angular framework fundamentals.",
    ],
    // Vue rating options
    vue: [
      "Expert in Vue.js with strong understanding of reactivity, composition API, and advanced patterns. Creates optimized component structures.",
      "Solid understanding of Vue.js core concepts. Can implement components, directives, and understands the Vue lifecycle.",
      "Basic familiarity with Vue.js syntax and component structure but limited practical experience.",
      "Minimal knowledge of Vue.js framework fundamentals.",
    ],
    // Node.js rating options
    node: [
      "Expert in Node.js with deep understanding of event loop, streams, and async patterns. Creates scalable server architectures.",
      "Solid understanding of Node.js core concepts and common modules. Can build robust server applications.",
      "Basic familiarity with Node.js but limited understanding of core concepts and practical applications.",
      "Minimal knowledge of Node.js fundamentals.",
    ],
    // Data Structure & Algorithms
    dsa: [
      "Expert in algorithm design and optimization. Demonstrates excellent problem-solving skills with optimal solutions.",
      "Good understanding of common data structures and algorithms. Can analyze time/space complexity and optimize solutions.",
      "Basic understanding of fundamental data structures but struggles with complex algorithm design.",
      "Limited knowledge of data structures and algorithms. Has difficulty solving even basic problems.",
    ],
    // System Design
    system_design: [
      "Expert in architectural patterns and system design principles. Creates scalable, maintainable solutions considering all factors.",
      "Good understanding of system components and how they interact. Can design solutions for moderately complex problems.",
      "Basic understanding of system components but struggles with designing complete, scalable solutions.",
      "Limited knowledge of system design principles. Has difficulty breaking down problems into components.",
    ],
    // Machine Coding
    machine_coding: [
      "Excellent at translating requirements into well-structured, maintainable code with proper patterns and best practices.",
      "Good at implementing requirements with clean code organization. Considers edge cases and error handling.",
      "Can implement basic functionality but struggles with structure, patterns, and comprehensive solutions.",
      "Difficulty in translating requirements into working code. Code lacks organization and robustness.",
    ],
    // Default rating options for any other skill
    default: [
      "Demonstrates expert-level knowledge and practical application of concepts. Shows deep understanding of best practices.",
      "Shows solid understanding of core concepts with good practical experience. Can implement solutions with minimal guidance.",
      "Has basic theoretical knowledge but limited practical experience. Requires guidance for implementation.",
      "Insufficient knowledge and experience for the position requirements.",
    ],
  };
  let options =
    ratingOptionsBySkill[section.toLowerCase().replace(/\s+/g, "_")] ||
    ratingOptionsBySkill.default;
  // Determine which option should be selected based on rating
  let selectedIndex = 0;
  if (rating >= 8) selectedIndex = 0;
  else if (rating >= 6) selectedIndex = 1;
  else if (rating >= 4) selectedIndex = 2;
  else selectedIndex = 3;

  return options.map((text, index) => ({
    text,
    selected: index === selectedIndex,
  }));
};

/**
 * Process React JS evaluations with subsections
 * @param {Object} evaluation - The evaluation object
 * @returns {Array} Array of React elements for the subsections
 */
const processReactEvaluation = (evaluation) => {
  if (!evaluation.subSections) return null;

  return evaluation.subSections.map((subsection, index) => (
    <View key={index} style={{ marginBottom: 15 }}>
      <Text style={styles.subTitle}>{subsection.title}</Text>

      {/* Rating options */}
      <View style={styles.ratingOptionsContainer}>
        {subsection.ratingOptions.map((option, optIndex) => (
          <View key={optIndex} style={styles.ratingOption}>
            <View style={[styles.checkbox, optIndex === 0 && styles.checked]}>
              {optIndex === 0 && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </View>
        ))}
      </View>

      {/* Strengths */}
      <View style={styles.feedbackSection}>
        <Text style={[styles.feedbackLabel, { color: COLORS.success.main }]}>
          Strengths
        </Text>
        <View style={styles.bulletItem}>
          <Text style={styles.strengthsBullet}>+</Text>
          <Text style={styles.bulletText}>{subsection.strengths}</Text>
        </View>
      </View>

      {/* Areas of improvement */}
      <View style={[styles.feedbackSection, { marginTop: 8 }]}>
        <Text style={[styles.feedbackLabel, { color: COLORS.warning.main }]}>
          Areas for Improvement
        </Text>
        <View style={styles.bulletItem}>
          <Text style={styles.improvementBullet}>△</Text>
          <Text style={styles.bulletText}>{subsection.areasOfImprovement}</Text>
        </View>
      </View>
    </View>
  ));
};

/**
 * Main component for rendering the Interview Report PDF
 * @param {Object} props - Component props
 * @param {Object} props.data - Interview data (defaults to sampleData)
 * @returns {React.Component} The PDF Document component
 */
const InterviewReportPDF = ({ data }) => {
  const { candidateInfo, ratings, questionsAsked, evaluations } = data;

  // Generate current timestamp for the report
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /**
   * Helper function for rating visualization
   * @param {number} rating - The rating value
   * @param {number} maxRating - The maximum possible rating
   * @returns {React.Element} The rating bar visualization
   */
  const renderRatingBar = (rating, maxRating = 10) => {
    const percentage = (rating / maxRating) * 100;
    const color = getRatingColor(rating);

    return (
      <View style={styles.skillBar}>
        <View
          style={[
            styles.skillFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with title */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              Technical Interview Assessment
            </Text>
            <Text style={styles.headerSubtitle}>
              Candidate Evaluation Report
            </Text>
          </View>
          {/* Company logo placeholder */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>COMPANY LOGO</Text>
          </View>
        </View>

        {/* Candidate Information Section */}
        <View style={styles.candidateSection}>
          <View style={styles.candidateInfo}>
            <Text style={styles.sectionTitle}>Candidate Information</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Position:</Text>
              <Text style={styles.value}>{candidateInfo.position}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Interviewer:</Text>
              <Text style={styles.value}>
                {candidateInfo.interviewerCredentials}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Interview date:</Text>
              <Text style={styles.value}>{candidateInfo.interviewDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{candidateInfo.totalTimeSpent}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Round:</Text>
              <Text style={styles.value}>{candidateInfo.roundName}</Text>
            </View>
          </View>

          <View style={styles.candidateMetrics}>
            <Text style={[styles.sectionTitle, styles.whiteText]}>
              Final Decision
            </Text>

            <View style={styles.decisionBox}>
              <Text style={[styles.label, styles.whiteText]}>
                Interviewer's assessment:
              </Text>
              <Text style={styles.decisionText}>
                {candidateInfo.interviewerDecision}
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Legend Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Assessment Rating Scale</Text>

          <View style={styles.ratingLegend}>
            <View style={styles.ratingLegendItem}>
              <View
                style={[
                  styles.ratingLegendIndicator,
                  { backgroundColor: COLORS.danger.main },
                ]}
              />
              <Text style={styles.text}>0-3: Strong no</Text>
            </View>
            <View style={styles.ratingLegendItem}>
              <View
                style={[
                  styles.ratingLegendIndicator,
                  { backgroundColor: COLORS.warning.main },
                ]}
              />
              <Text style={styles.text}>4-5: No</Text>
            </View>
            <View style={styles.ratingLegendItem}>
              <View
                style={[
                  styles.ratingLegendIndicator,
                  { backgroundColor: COLORS.primary.light },
                ]}
              />
              <Text style={styles.text}>6-7: Yes</Text>
            </View>
            <View style={styles.ratingLegendItem}>
              <View
                style={[
                  styles.ratingLegendIndicator,
                  { backgroundColor: COLORS.success.main },
                ]}
              />
              <Text style={styles.text}>8-10: Strong yes</Text>
            </View>
          </View>
        </View>

        {/* Skills Rating Section */}
        {/* Skills Rating Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Technical Skills Assessment</Text>
          {ratings && Object.keys(ratings).length > 0 ? (
            <View style={styles.skillRatingsContainer}>
              {Object.entries(ratings).map(([skillName, rating], index) => (
                <View key={index} style={styles.skillRow}>
                  <Text style={styles.skillLabel}>
                    {skillName.toUpperCase()}
                  </Text>
                  {renderRatingBar(rating)}
                  <Text style={styles.skillValue}>{rating}/10</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>No skills data available.</Text>
          )}
        </View>

        {/* Questions Asked Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Interview Questions</Text>

          {questionsAsked && questionsAsked.length > 0 ? (
            questionsAsked.map((section, index) => (
              <View key={index} style={styles.questionCategory}>
                {section.section && (
                  <Text style={styles.subTitle}>{section.section}</Text>
                )}

                {section.questions && section.questions.length > 0 ? (
                  section.questions.map((q, qIndex) => (
                    <View key={qIndex} style={styles.question}>
                      <View style={styles.bulletPoint} />
                      <Text>{q}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>{section}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.text}>
              No questions have been recorded for this interview.
            </Text>
          )}
        </View>

        {/* Detailed Evaluations */}
        <Text style={[styles.title, { marginTop: 10 }]}>
          Detailed Assessment
        </Text>

        {evaluations && evaluations.length > 0 ? (
          evaluations.map((evaluation, index) => (
            <View key={index} style={styles.evaluationSection}>
              <View style={styles.evaluationHeader}>
                <View style={styles.evaluationBadge}>
                  <Text style={styles.evaluationNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.evaluationTitle}>{evaluation.section}</Text>
              </View>

              {/* For regular evaluations */}
              {!evaluation.subSections && (
                <>
                  {/* Rating display */}
                  <View style={styles.ratingDisplayContainer}>
                    <View
                      style={[
                        styles.ratingCircle,
                        {
                          backgroundColor: getRatingColor(evaluation.rating),
                        },
                      ]}
                    >
                      <Text style={styles.ratingDisplayValue}>
                        {typeof evaluation.rating === "string"
                          ? evaluation.rating.split("/")[0]
                          : evaluation.rating}
                      </Text>
                    </View>
                    <Text style={styles.ratingText}>
                      {typeof evaluation.rating === "string"
                        ? evaluation.rating
                        : `${evaluation.rating}/10`}{" "}
                      -{" "}
                      {getRatingText(
                        typeof evaluation.rating === "string"
                          ? parseInt(evaluation.rating.split("/")[0])
                          : evaluation.rating
                      )}
                    </Text>
                  </View>

                  {/* Rating options */}
                  <View style={styles.ratingOptionsContainer}>
                    {getRatingOptions(
                      evaluation.section,
                      typeof evaluation.rating === "string"
                        ? parseInt(evaluation.rating.split("/")[0])
                        : evaluation.rating
                    ).map((option, optIndex) => (
                      <View key={optIndex} style={styles.ratingOption}>
                        <View
                          style={[
                            styles.checkbox,
                            option.selected && styles.checked,
                          ]}
                        >
                          {option.selected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.optionText}>{option.text}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Strengths */}
                  <View style={styles.feedbackSection}>
                    <Text
                      style={[
                        styles.feedbackLabel,
                        { color: COLORS.success.main },
                      ]}
                    >
                      Strengths
                    </Text>
                    <View style={styles.bulletItem}>
                      <Text style={styles.strengthsBullet}>+</Text>
                      <Text style={styles.bulletText}>
                        {evaluation.strengths}
                      </Text>
                    </View>
                  </View>

                  {/* Areas of improvement */}
                  <View style={[styles.feedbackSection, { marginTop: 8 }]}>
                    <Text
                      style={[
                        styles.feedbackLabel,
                        { color: COLORS.warning.main },
                      ]}
                    >
                      Areas for Improvement
                    </Text>
                    <View style={styles.bulletItem}>
                      <Text style={styles.improvementBullet}>△</Text>
                      <Text style={styles.bulletText}>
                        {evaluation.areasOfImprovement}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* For React JS with subsections */}
              {evaluation.subSections && processReactEvaluation(evaluation)}
            </View>
          ))
        ) : (
          <View style={styles.section}>
            <Text style={styles.text}>
              No detailed evaluations have been recorded.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Confidential Interview Assessment
          </Text>
          <View style={styles.footerRight}>
            <Text style={styles.timestamp}>Generated: {formattedDate}</Text>
            <Text style={styles.pageNumber}>Page 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InterviewReportPDF;
