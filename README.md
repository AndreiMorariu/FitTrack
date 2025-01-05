# FitTrack

## Overview

The **Fitness Tracker** is a web application designed to help users track their workouts, set fitness goals, and receive AI-generated recommendations based on workout data. This single-page application allows users to manage various aspects of their fitness journey, including creating custom workouts, monitoring progress, and getting insights to improve performance. Whether for cardio, strength training, or flexibility, the app provides a streamlined experience with detailed tracking and AI assistance.

### Why I Built This Application

I created the **Fitness Tracker** because I wanted a comprehensive, easy-to-use platform to track my own workouts and progress. While there are many fitness apps available, I wanted a customizable solution where I could create my own workouts, set and track personal goals, and leverage AI to analyze my fitness data and provide tailored insights. This app allows users to keep a record of their fitness activities and get real-time feedback to optimize their workouts and goals.

## Features

- **Dashboard**: View workout statistics such as total workout time, most active day, favorite exercises, and other performance metrics.
- **AI-Driven Insights**: Based on your workout history and goals, the AI provides personalized workout recommendations and performance analysis.
- **Workout Creation**: Create custom workouts for cardio, strength training, or flexibility. Alternatively, use the AI to generate a workout plan based on specific parameters you provide.
- **Goals Management**: Set, track, and complete fitness goals. The app allows users to check progress and mark goals as completed once achieved.
- **Responsive Design**: The app is optimized for both desktop and mobile devices.
- **Dark Mode Support**: For a comfortable viewing experience in low-light environments.
- **Charts and Visualizations**: View your performance metrics through interactive charts, providing insights into trends and progress.

## Technology Stack

- **Frontend**:
  - **React**: JavaScript library for building user interfaces.
  - **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
  - **Chart.js**: JavaScript library for creating dynamic and interactive charts to display workout statistics and progress.
  - **shadcn/ui**: Reusable components built with Radix UI and Tailwind CSS for enhanced user interface elements.
    
## Application Structure

The application consists of three main pages:

### 1. **Dashboard**
   - Displays statistics about your workouts, including total workout time, most active day, and favorite exercise.
   - Contains charts to visualize your progress over time.
   - Features an AI-powered section that analyzes your data and provides insights and recommendations based on your goals.

![dashboard](https://github.com/user-attachments/assets/305d590b-5c6f-4d42-8f73-faf72ab21970)

### 2. **Workouts**
   - **Create Workout**: Build your own workout plans, including exercises for cardio, strength, or flexibility.
   - **AI Workout Generator**: Let the AI generate a workout for you based on the parameters you provide.
   - **All Workouts**: View and manage all your previously created workouts.
   - **Completed Workouts**: Track the workouts you’ve completed with detailed results.

![workouts](https://github.com/user-attachments/assets/78dd2895-1bf8-4d2c-be5e-54e009fc1317)

### 3. **Goals**
   - **Set New Goals**: Define new fitness goals, such as increasing workout duration or improving specific exercise performance.
   - **Current Goals**: View ongoing and in-progress goals.
   - **Completed Goals**: Track the goals you've completed and reflect on your progress.
     
![goals](https://github.com/user-attachments/assets/c75a82ed-af51-4646-9ba9-da31effb108e)

## API Integration

The **Fitness Tracker** app uses AI to analyze your workout data and provide personalized insights. The AI integration can generate new workouts and suggest performance adjustments based on your progress.

