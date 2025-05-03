import cron from "node-cron";
import { autoAllocateSavings } from "../controllers/goal.controller.js";
import nodemailer from "nodemailer";
import { Goal } from "../models/goal.model.js";

//email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "it22115720@my.sliit.lk",
        pass: "ASAnka119@",
    },
});

const sendNotification = (userEmail, category, remainingAmount, threshold) => {
    const progressPercentage = ((remainingAmount / threshold) * 100).toFixed(2);
    const mailOptions = {
        from: "your-email@gmail.com",
        to: userEmail,
        subject: `Budget Threshold Alert for ${category}`,
        text: `Your budget for ${category} is almost finished! You've used ${progressPercentage}% of your allocated budget. Remaining: ${remainingAmount}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending budget threshold notification:", error);
        } else {
            console.log("Budget threshold notification sent:", info.response);
        }
    });
};

//function to send completion emails
const sendGoalCompletionEmail = (userEmail, goalName) => {
    const mailOptions = {
        from: "it22115720@my.sliit.lk",
        to: userEmail,
        subject: "Goal Completed!",
        text: `Congratulations! You have successfully completed your goal of ${goalName}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

//function to send progress update emails
const sendProgressUpdateEmail = (userEmail, goalName, progressPercentage) => {
    const mailOptions = {
        from: "your-email@gmail.com",
        to: userEmail,
        subject: `Your Goal Progress: ${goalName}`,
        text: `You're making great progress! You've reached ${progressPercentage}% of your goal to save for ${goalName}. Keep going!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending progress update email:", error);
        } else {
            console.log("Progress update email sent:", info.response);
        }
    });
};

//const send warnig message


//cron job for automatic savings allocation
cron.schedule("0 * * * *", async () => {
    console.log("Running automatic savings allocation...");
    await autoAllocateSavings();
});

//cron job for daily goal completion check
cron.schedule("0 0 * * *", async () => {
    console.log("Checking for completed goals...");
    try {
        const completedGoals = await Goal.find({ status: "completed" });

        completedGoals.forEach((goal) => {
            sendGoalCompletionEmail(goal.userEmail, goal.goalName);
        });
    } catch (error) {
        console.log("Error checking completed goals:", error);
    }
});

//cron job for progress update notification
cron.schedule("0 * * * *", async () => {
    console.log("Checking for progress updates...");
    try {
        const goals = await Goal.find({ status: "active" });

        goals.forEach((goal) => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

            if (progressPercentage >= 50 && progressPercentage < 60) {
                sendProgressUpdateEmail(goal.userEmail, goal.goalName, progressPercentage);
            } else if (progressPercentage >= 75 && progressPercentage < 80) {
                sendProgressUpdateEmail(goal.userEmail, goal.goalName, progressPercentage);
            }
        });
    } catch (error) {
        console.log("Error checking progress:", error);
    }
});
