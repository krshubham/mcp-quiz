export const quizQuestions = [
  // Easy Questions (1-5) - Basic concepts
  {
    id: 1,
    question: "What does MCP stand for?",
    options: [
      "Model Context Protocol", 
      "Machine Code Protocol", 
      "Message Communication Protocol", 
      "Multi-Client Platform"
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: "MCP stands for Model Context Protocol - an open protocol that standardizes how applications provide context to large language models (LLMs).",
    category: "Fundamentals"
  },
  {
    id: 2,
    question: "What is the primary purpose of MCP?",
    options: [
      "To replace existing databases",
      "To standardize how AI applications connect to data sources and tools",
      "To create new programming languages",
      "To improve internet connectivity"
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "MCP provides a standardized way to connect AI models to different data sources and tools, like a USB-C port for AI applications.",
    category: "Fundamentals"
  },
  {
    id: 3,
    question: "MCP follows which architectural pattern?",
    options: [
      "Peer-to-peer architecture",
      "Client-server architecture", 
      "Mesh network architecture",
      "Blockchain architecture"
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "MCP follows a client-server architecture where an MCP host establishes connections to one or more MCP servers through MCP clients.",
    category: "Architecture"
  },
  {
    id: 4,
    question: "How many core building blocks does an MCP server provide?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "MCP servers provide functionality through three core building blocks: Tools (for AI actions), Resources (for context data), and Prompts (for interaction templates).",
    category: "Architecture"
  },
  {
    id: 5,
    question: "Which of these is NOT a core building block of MCP?",
    options: ["Tools", "Resources", "Prompts", "Databases"],
    correctAnswer: 3,
    difficulty: 'easy',
    explanation: "The three core building blocks are Tools, Resources, and Prompts. Databases are not a core building block, though they can be accessed through Resources.",
    category: "Architecture"
  },

  // Medium Questions (6-12) - Deeper understanding
  {
    id: 6,
    question: "What is the relationship between MCP clients and servers?",
    options: [
      "Many clients can connect to one server",
      "One client maintains a one-to-one connection with one server",
      "Clients and servers share bidirectional connections",
      "Multiple clients share connections to multiple servers"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Each MCP client maintains a dedicated one-to-one connection with its corresponding MCP server. When a host connects to multiple servers, it instantiates multiple client objects.",
    category: "Architecture"
  },
  {
    id: 7,
    question: "Who controls the execution of Tools in MCP?",
    options: [
      "The user directly",
      "The application automatically", 
      "The model, but requires user approval",
      "The server administrator"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "Tools are model-controlled, meaning AI models can discover and invoke them automatically. However, tool execution requires explicit user approval for security and control.",
    category: "Building Blocks"
  },
  {
    id: 8,
    question: "Resources in MCP use which identification system?",
    options: [
      "Database IDs",
      "File paths only", 
      "URI-based identification",
      "Numeric indices"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "Resources use URI-based identification, with each resource having a unique URI such as 'file:///path/to/document.md' or 'calendar://events/2024'.",
    category: "Building Blocks"
  },
  {
    id: 9,
    question: "What are the two discovery patterns for Resources?",
    options: [
      "Static and dynamic resources",
      "Direct resources and resource templates",
      "Local and remote resources", 
      "Public and private resources"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Resources support two discovery patterns: direct resources with fixed URIs, and resource templates with parameterized URIs like 'travel://activities/{city}/{category}'.",
    category: "Building Blocks"
  },
  {
    id: 10,
    question: "Which entity controls Prompts in MCP?",
    options: [
      "The AI model automatically",
      "The application server", 
      "The user explicitly",
      "The system administrator"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "Prompts are user-controlled, requiring explicit invocation rather than automatic triggering. They provide structured templates for common tasks.",
    category: "Building Blocks"
  },
  {
    id: 11,
    question: "What encoding must JSON-RPC messages use in MCP?",
    options: ["ASCII", "UTF-8", "UTF-16", "Base64"],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "MCP uses JSON-RPC to encode messages, and JSON-RPC messages MUST be UTF-8 encoded according to the specification.",
    category: "Protocol"
  },
  {
    id: 12,
    question: "Which transport mechanism should MCP clients support whenever possible?",
    options: ["HTTP only", "stdio", "WebSocket", "gRPC"],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "Clients SHOULD support stdio (standard input/output) whenever possible. MCP defines stdio and Streamable HTTP as standard transport mechanisms.",
    category: "Transport"
  },

  // Hard Questions (13-20) - Advanced concepts and nuances
  {
    id: 13,
    question: "In a Resource Template like 'travel://activities/{city}/{category}', what happens when you substitute 'barcelona' for {city} and 'museums' for {category}?",
    options: [
      "It creates a new resource",
      "It returns an error",
      "It returns all museums in Barcelona", 
      "It lists all cities with museums"
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: "Resource Templates enable dynamic resource access. 'travel://activities/barcelona/museums' would return filtered activity data for all museums in Barcelona by substituting the parameters.",
    category: "Advanced Features"
  },
  {
    id: 14,
    question: "What is the key difference between a 'local' and 'remote' MCP server?",
    options: [
      "Local servers are faster than remote servers",
      "Local servers use stdio transport, remote servers use HTTP transport",
      "Local servers can't access external data",
      "Remote servers require special authentication"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Local MCP servers typically run on the same machine using stdio transport (like filesystem server), while remote servers run on different platforms using Streamable HTTP transport (like Sentry MCP server).",
    category: "Implementation"
  },
  {
    id: 15,
    question: "What is parameter completion in the context of MCP Resources?",
    options: [
      "Automatically filling in missing parameters",
      "Validating parameter formats", 
      "Suggesting valid parameter values as you type",
      "Encrypting sensitive parameters"
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: "Parameter completion helps users discover valid values for dynamic resources. For example, typing 'Par' for weather://forecast/{city} might suggest 'Paris' or 'Park City'.",
    category: "Advanced Features"
  },
  {
    id: 16,
    question: "Which protocol operation is used to monitor Resource changes?",
    options: [
      "resources/list",
      "resources/read", 
      "resources/subscribe",
      "resources/watch"
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: "The 'resources/subscribe' operation is used to monitor resource changes and returns a subscription confirmation, enabling real-time updates.",
    category: "Protocol Operations"
  },
  {
    id: 17,
    question: "In MCP's user interaction model, what happens when an AI model wants to execute a tool that could send an email?",
    options: [
      "The email is sent immediately",
      "The user must approve the action before execution",
      "The action is logged for later review", 
      "The server automatically blocks the action"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "MCP emphasizes human oversight through approval mechanisms. Before any tool execution (especially potentially sensitive actions like sending emails), users must be presented with clear approval dialogs.",
    category: "Security & Control"
  },
  {
    id: 18,
    question: "What is the purpose of MIME types in MCP Resources?",
    options: [
      "To encrypt resource contents",
      "To enable appropriate content handling",
      "To determine resource permissions", 
      "To compress resource data"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Resources declare MIME types for appropriate content handling, helping applications understand how to process and display the resource content correctly.",
    category: "Technical Details"
  },
  {
    id: 19,
    question: "Which of these is a recommended UI pattern for exposing Prompts to users?",
    options: [
      "Hidden system commands",
      "Slash commands (typing '/' to see available prompts)", 
      "Automatic execution based on keywords",
      "Background processing without user interaction"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Applications typically expose prompts through various UI patterns including slash commands (typing '/' to see available prompts like /plan-vacation), command palettes, or dedicated UI buttons.",
    category: "User Experience"
  },
  {
    id: 20,
    question: "What is a key principle of MCP's design regarding context and AI applications?",
    options: [
      "AI models should have unlimited access to all data",
      "Applications should handle context retrieval and decide how to use it",
      "All context must be stored in a central database", 
      "Context should only be text-based"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: "Resources are application-driven, giving hosts flexibility in how they retrieve, process, and present available context. Applications can choose to select subsets, use embeddings, or pass raw data to models.",
    category: "Design Philosophy"
  }
];
