


export const templates = [
  { 
    id: "blank", 
    label: "Blank Document", 
    imageUrl: "/blank-document.svg",
    initialContent: ""
  },
  { 
    id: "software-proposal",
    label: "Software development proposal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software development proposal</h1>
      <h2>Project Overview</h2>
      <p>Brief description of the proposed software development project.</p>

      <h2>Scope of Work</h2>
      <p>Detailed breakdown of the project deliverables and requirements.</p>

      <h2>Timeline</h2>
      <p>Project milestones and delivery shcedule.</p>

      <h2>Budget</h2>
      <p>Cost breakdown and payment terms.</p>
    `
  },
  {
    id: "project-proposal",
    label: "Project proposal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1>Project Proposal</h1>
      <h2>Introduction</h2>
      <p>Outline the purpose and goals of the proposed project.</p>

      <h2>Objectives</h2>
      <p>Define the key objectives and expected outcomes of the project.</p>

      <h2>Methodology</h2>
      <p>Describe the approach, methods, and tools that will be used.</p>

      <h2>Conclusion</h2>
      <p>Summarize the benefits and call to action.</p>
    `
  }, 
  {
    id: "business-letter",
    label: "Business letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <h1>Business Letter</h1>
      <p>[Your Name]</p>
      <p>[Your Position]</p>
      <p>[Company Name]</p>
      <p>[Date]</p>

      <p>[Recipient Name]</p>
      <p>[Recipient Position]</p>
      <p>[Recipient Company]</p>

      <h2>Subject</h2>
      <p>[Insert subject here]</p>

      <p>Dear [Recipient Name],</p>
      <p>[Body of the letter]</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>[Your Name]</h1>
      <p>[Your Contact Information]</p>

      <h2>Professional Summary</h2>
      <p>A brief summary highlighting your experience and skills.</p>

      <h2>Work Experience</h2>
      <p>[Job Title], [Company Name], [Years]</p>
      <p>Responsibilities and achievements.</p>

      <h2>Education</h2>
      <p>[Degree], [Institution], [Year]</p>

      <h2>Skills</h2>
      <ul>
        <li>[Skill 1]</li>
        <li>[Skill 2]</li>
        <li>[Skill 3]</li>
      </ul>
    `
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <h1>Cover Letter</h1>
      <p>[Your Name]</p>
      <p>[Your Contact Information]</p>

      <p>[Date]</p>

      <p>[Recipient Name]</p>
      <p>[Recipient Position]</p>
      <p>[Company Name]</p>

      <p>Dear [Recipient Name],</p>
      <p>[Body of the letter: Introduce yourself, highlight your qualifications, and explain why you are a good fit for the position.]</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <h1>Letter</h1>
      <p>[Your Name]</p>
      <p>[Your Contact Information]</p>

      <p>[Date]</p>

      <p>[Recipient Name]</p>
      <p>[Recipient Address]</p>

      <p>Dear [Recipient Name],</p>
      <p>[Body of the letter]</p>
      <p>Kind regards,</p>
      <p>[Your Name]</p>
    `
  }
]