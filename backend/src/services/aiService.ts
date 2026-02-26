// ========================================
// GeoAdTech — AI Personalization Service
// ========================================

/**
 * AI Service for template-based message generation.
 * This simulates a fine-tuned LLM output based on project context.
 */

export interface MessagePayload {
    projectName: string;
    category: string;
    completionPercentage: number;
    campaignText?: string;
    tone?: string;
}

export const generatePersonalizedMessage = (payload: MessagePayload) => {
    const { projectName, category, completionPercentage, campaignText, tone } = payload;

    const templates = {
        hospital: [
            { title: "🏥 Healthcare at Your Door", body: "A new standard of wellness is rising. {project} is {percent}% done. Your health is our priority." },
            { title: "✨ Healing Hearts Nearby", body: "The wait is almost over. {project} is currently {percent}% complete. Better care for your family." }
        ],
        bridge: [
            { title: "🌉 Connecting Communities", body: "Traffic woes will soon be history. {project} is {percent}% through. Bridging the gap for a faster Delhi." },
            { title: "🚀 Scaling New Heights", body: "Infrastructure that inspires. {project} reached {percent}% today. Engineering a smoother commute." }
        ],
        metro: [
            { title: "🚇 Travel in Comfort", body: "Your next station is closer than you think. {project} is {percent}% complete. Redefining city travel." },
            { title: "⚡ Speeding up NCR", body: "More lines, less stress. {project} is tracking at {percent}%. The heartbeat of our city gets stronger." }
        ],
        road: [
            { title: "🛣️ Paving the Way", body: "Smooth roads, happy journeys. {project} is {percent}% finished. Investing in your safe travels." },
            { title: "📍 Modernizing Arteries", body: "A smoother Delhi beckons. Work on {project} is {percent}% done. Thank you for your patience." }
        ],
        default: [
            { title: "🚨 New Milestone: {project}", body: "Great progress! This {category} work is now {percent}% complete. Making life easier for you." },
            { title: "🏛️ Civic Update Near You", body: "Transparency in action: {project} is {percent}% done. Built for the citizens, by the leaders." }
        ]
    };

    const categoryTemplates = templates[category as keyof typeof templates] || templates.default;
    const selected = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];

    let body = selected.body
        .replace('{project}', projectName)
        .replace('{percent}', completionPercentage.toString())
        .replace('{category}', category);

    let title = selected.title.replace('{project}', projectName);

    if (campaignText) {
        body += ` Note: ${campaignText}`;
    }

    // AI Tone overrides if provided
    if (tone === 'inspirational') {
        title = `🌟 ${title}`;
        body = `Behold! ${body} A testament to our shared vision.`;
    }

    return { title, body };
};
