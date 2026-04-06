import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const topics = [
  { name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🧠', color: '#6C5CE7', description: 'Neural networks, deep learning, NLP, computer vision, and ML fundamentals.', order: 0 },
  { name: 'Cybersecurity', slug: 'cybersecurity', icon: '🔐', color: '#00B894', description: 'Network security, ethical hacking, cryptography, and security best practices.', order: 1 },
  { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: '☁️', color: '#0984E3', description: 'AWS, GCP, Azure, Docker, Kubernetes, CI/CD, and infrastructure as code.', order: 2 },
  { name: 'DSA & Algorithms', slug: 'dsa', icon: '⚡', color: '#FDCB6E', description: 'Data structures, sorting algorithms, dynamic programming, and problem-solving.', order: 3 },
  { name: 'System Design', slug: 'system-design', icon: '🏗️', color: '#E17055', description: 'Scalable architectures, distributed systems, databases, and design patterns.', order: 4 },
  { name: 'Full Stack Web', slug: 'fullstack', icon: '🌐', color: '#00CEC9', description: 'React, Node.js, REST APIs, databases, and modern web development.', order: 5 },
]

const subtopics: Record<string, Array<{ name: string; slug: string; description: string; icon: string }>> = {
  'ai-ml': [
    { name: 'Neural Networks', slug: 'neural-networks', icon: '🔬', description: 'Deep learning architectures and backpropagation.' },
    { name: 'NLP', slug: 'nlp', icon: '💬', description: 'Natural language processing and transformers.' },
    { name: 'Computer Vision', slug: 'computer-vision', icon: '👁️', description: 'Image recognition and convolutional neural networks.' },
  ],
  'cybersecurity': [
    { name: 'Network Security', slug: 'network-security', icon: '🌐', description: 'Firewalls, VPNs, and network protocols.' },
    { name: 'Ethical Hacking', slug: 'ethical-hacking', icon: '💻', description: 'Penetration testing and vulnerability assessment.' },
    { name: 'Cryptography', slug: 'cryptography', icon: '🔑', description: 'Encryption algorithms and public key infrastructure.' },
  ],
  'cloud-devops': [
    { name: 'AWS Fundamentals', slug: 'aws', icon: '☁️', description: 'Core AWS services and architecture.' },
    { name: 'Docker & Kubernetes', slug: 'containers', icon: '🐳', description: 'Containerization and orchestration.' },
    { name: 'CI/CD Pipelines', slug: 'cicd', icon: '🔄', description: 'Continuous integration and deployment.' },
  ],
  'dsa': [
    { name: 'Arrays & Strings', slug: 'arrays-strings', icon: '📊', description: 'Fundamental data structures.' },
    { name: 'Trees & Graphs', slug: 'trees-graphs', icon: '🌲', description: 'Non-linear data structures.' },
    { name: 'Dynamic Programming', slug: 'dynamic-programming', icon: '⚡', description: 'Optimization through memoization.' },
  ],
  'system-design': [
    { name: 'Distributed Systems', slug: 'distributed-systems', icon: '🕸️', description: 'CAP theorem and distributed consensus.' },
    { name: 'Database Design', slug: 'database-design', icon: '🗄️', description: 'SQL vs NoSQL and database optimization.' },
    { name: 'API Design', slug: 'api-design', icon: '🔌', description: 'REST, GraphQL, and API best practices.' },
  ],
  'fullstack': [
    { name: 'React & Next.js', slug: 'react-nextjs', icon: '⚛️', description: 'Modern React patterns and Next.js.' },
    { name: 'Node.js & Express', slug: 'nodejs', icon: '🟢', description: 'Backend development with Node.js.' },
    { name: 'Databases & SQL', slug: 'databases-sql', icon: '🗃️', description: 'PostgreSQL, MySQL, and MongoDB.' },
  ],
}

const flashcardData: Record<string, Array<{ question: string; answer: string; hint?: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD' }>> = {
  'ai-ml': [
    { question: 'What is the vanishing gradient problem?', answer: 'When gradients become extremely small during backpropagation in deep networks, making earlier layers learn very slowly. Solved by ReLU activations, batch normalization, or residual connections.', hint: 'Think about what happens to gradients as they propagate backwards', difficulty: 'HARD' },
    { question: 'What is overfitting and how do you prevent it?', answer: 'Overfitting is when a model performs well on training data but poorly on unseen data. Prevention: regularization (L1/L2), dropout, early stopping, cross-validation, data augmentation, and getting more training data.', difficulty: 'MEDIUM' },
    { question: 'What is a transformer architecture?', answer: 'A deep learning architecture based on self-attention mechanisms. Uses encoder-decoder structure with multi-head attention, positional encoding, and feed-forward layers. Foundation of BERT, GPT, etc.', difficulty: 'HARD' },
    { question: 'Explain the bias-variance tradeoff', answer: 'High bias = underfitting (model too simple). High variance = overfitting (model too complex). The goal is to find the sweet spot. Increasing model complexity reduces bias but increases variance.', difficulty: 'MEDIUM' },
    { question: 'What is gradient descent?', answer: 'An optimization algorithm that iteratively adjusts model parameters to minimize the loss function by moving in the direction of the steepest descent (negative gradient).', difficulty: 'EASY' },
    { question: 'What is batch normalization?', answer: 'Technique that normalizes the input of each layer to have zero mean and unit variance during training. Speeds up training, allows higher learning rates, and reduces sensitivity to weight initialization.', difficulty: 'MEDIUM' },
    { question: 'What is a convolutional neural network (CNN)?', answer: 'A DNN that uses convolutional layers to automatically learn spatial hierarchies of features from images. Key components: convolution, pooling, ReLU activation, fully connected layers.', difficulty: 'MEDIUM' },
    { question: 'What is transfer learning?', answer: 'Using a pre-trained model (trained on large dataset) as starting point for a different but related task. Fine-tune the model on your specific dataset. Saves time and data.', difficulty: 'EASY' },
    { question: 'What is the attention mechanism?', answer: 'Allows models to focus on relevant parts of the input when generating output. Computes a weighted sum of values based on similarity between query and keys. Core of transformer models.', hint: 'Think about how humans focus on relevant words when translating', difficulty: 'HARD' },
    { question: 'What is precision vs recall?', answer: 'Precision = TP/(TP+FP) — out of predicted positives, how many are actually positive. Recall = TP/(TP+FN) — out of actual positives, how many did we predict correctly. F1-score is harmonic mean.', difficulty: 'MEDIUM' },
  ],
  'cybersecurity': [
    { question: 'What is SQL injection?', answer: 'A web security vulnerability where an attacker inserts malicious SQL code into input fields to manipulate database queries. Prevention: parameterized queries, input validation, ORMs, least privilege.', hint: 'Think about what happens when user input is concatenated directly into SQL', difficulty: 'MEDIUM' },
    { question: 'What is XSS (Cross-Site Scripting)?', answer: 'An attack where malicious scripts are injected into websites viewed by other users. Types: Stored, Reflected, DOM-based. Prevention: output encoding, CSP headers, HttpOnly cookies.', difficulty: 'MEDIUM' },
    { question: 'What is a buffer overflow attack?', answer: 'When a program writes more data to a buffer than it can hold, overwriting adjacent memory. Can lead to code execution. Prevention: bounds checking, ASLR, stack canaries, DEP.', difficulty: 'HARD' },
    { question: 'Explain symmetric vs asymmetric encryption', answer: 'Symmetric: same key for encryption and decryption (AES, DES). Fast but key distribution problem. Asymmetric: public/private key pair (RSA, ECC). Slower but solves key distribution. HTTPS uses both.', difficulty: 'MEDIUM' },
    { question: 'What is a CSRF attack?', answer: 'Cross-Site Request Forgery tricks authenticated users into unknowingly submitting requests. Prevention: CSRF tokens, SameSite cookies, checking Origin/Referer headers.', difficulty: 'MEDIUM' },
    { question: 'What is the CIA triad?', answer: 'Confidentiality (data only accessible to authorized parties), Integrity (data hasn\'t been tampered with), Availability (systems accessible when needed). Foundation of information security.', difficulty: 'EASY' },
    { question: 'What is a man-in-the-middle attack?', answer: 'Attacker secretly intercepts and possibly alters communications between two parties who believe they\'re communicating directly. Prevention: TLS/SSL, certificate pinning, HSTS.', difficulty: 'MEDIUM' },
    { question: 'What is the difference between authentication and authorization?', answer: 'Authentication: verifying who you are (identity). Authorization: verifying what you\'re allowed to do (permissions). Auth before authz. E.g., login (authn) then checking if you can access admin panel (authz).', difficulty: 'EASY' },
    { question: 'What is a zero-day vulnerability?', answer: 'A software vulnerability unknown to the vendor, with no patch available. "Zero days" for the vendor to fix it. Extremely valuable to attackers as no defenses exist.', difficulty: 'EASY' },
    { question: 'What is penetration testing?', answer: 'Authorized simulated cyberattack on a system to identify vulnerabilities. Phases: Reconnaissance, Scanning, Exploitation, Post-exploitation, Reporting. White-box, black-box, or grey-box.', difficulty: 'MEDIUM' },
  ],
  'cloud-devops': [
    { question: 'What is the difference between IaaS, PaaS, and SaaS?', answer: 'IaaS: Infrastructure as a Service (VMs, storage, networking). PaaS: Platform as a Service (runtime, databases, middleware). SaaS: Software as a Service (complete applications). Each layer abstracts more from you.', difficulty: 'EASY' },
    { question: 'What is a Docker container vs a VM?', answer: 'Containers share the host OS kernel, are lightweight, and start in seconds. VMs have their own OS, more isolated but heavyweight. Containers use namespaces and cgroups for isolation.', difficulty: 'MEDIUM' },
    { question: 'What is Kubernetes and what problems does it solve?', answer: 'Container orchestration platform that automates deployment, scaling, and management of containerized applications. Solves: container scheduling, service discovery, load balancing, self-healing, rolling updates.', difficulty: 'MEDIUM' },
    { question: 'What is infrastructure as code (IaC)?', answer: 'Managing and provisioning infrastructure through machine-readable configuration files rather than manual processes. Tools: Terraform, CloudFormation, Ansible. Benefits: version control, repeatability, consistency.', difficulty: 'EASY' },
    { question: 'What is a CI/CD pipeline?', answer: 'Continuous Integration: automatically building and testing code on every commit. Continuous Delivery/Deployment: automatically deploying tested code to staging/production. Enables faster, more reliable releases.', difficulty: 'EASY' },
    { question: 'What are AWS Lambda and serverless computing?', answer: 'Lambda is a serverless compute service — run code without provisioning servers. You pay only for execution time. Scales automatically. Ideal for event-driven, stateless workloads.', difficulty: 'MEDIUM' },
    { question: 'What is a load balancer?', answer: 'Distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed. Types: Layer 4 (TCP/UDP) and Layer 7 (HTTP). AWS ALB, NLB. Improves availability and performance.', difficulty: 'EASY' },
    { question: 'What is a VPC in AWS?', answer: 'Virtual Private Cloud: isolated section of AWS cloud where you can launch resources in a virtual network you define. Control IP ranges, subnets, routing, security groups, and internet gateways.', difficulty: 'MEDIUM' },
    { question: 'What is the CAP theorem?', answer: 'Distributed system can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (every request gets response), Partition tolerance (system works despite network failures). Usually choose CP or AP.', difficulty: 'HARD' },
    { question: 'What is blue-green deployment?', answer: 'Deployment strategy with two identical environments (blue=production, green=new version). Deploy to green, test, then switch traffic. Easy rollback by switching back. Zero downtime.', difficulty: 'MEDIUM' },
  ],
  'dsa': [
    { question: 'What is the time complexity of binary search?', answer: 'O(log n) time complexity. Works on sorted arrays by repeatedly halving the search space. Space: O(1) iterative, O(log n) recursive.', difficulty: 'EASY' },
    { question: 'Explain Big O notation', answer: 'Describes algorithm\'s worst-case time/space complexity as input size grows. Common: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential.', difficulty: 'EASY' },
    { question: 'What is a hash table and its time complexity?', answer: 'Data structure using hash function to map keys to values. Average: O(1) for insert, delete, lookup. Worst case O(n) with collisions. Resolved via chaining or open addressing.', hint: 'Think about how dictionaries/maps work', difficulty: 'MEDIUM' },
    { question: 'What is the difference between BFS and DFS?', answer: 'BFS: explores nodes level by level, uses queue, finds shortest path in unweighted graphs. DFS: explores as far as possible, uses stack (or recursion), good for detecting cycles and topological sort.', difficulty: 'MEDIUM' },
    { question: 'What is dynamic programming?', answer: 'Optimization technique that solves complex problems by breaking them into overlapping subproblems, solving each once, and storing results (memoization/tabulation). Key: optimal substructure + overlapping subproblems.', difficulty: 'HARD' },
    { question: 'What is the time complexity of merge sort?', answer: 'O(n log n) in all cases (best, average, worst). Space: O(n). Stable sort. Divides array in half recursively, then merges sorted halves.', difficulty: 'MEDIUM' },
    { question: 'What is a balanced binary search tree?', answer: 'BST where height is O(log n). Examples: AVL trees (strict balance), Red-Black trees (loosely balanced, used in Java TreeMap). Ensures O(log n) search, insert, delete operations.', difficulty: 'HARD' },
    { question: 'What is Dijkstra\'s algorithm?', answer: 'Finds shortest path from source to all vertices in weighted graph with non-negative edges. Uses priority queue (min-heap). Time: O((V+E) log V). Doesn\'t work with negative edges.', difficulty: 'HARD' },
    { question: 'What is the two-pointer technique?', answer: 'Algorithm pattern using two pointers moving through data structure. Common: finding pairs that sum to target (sorted array), removing duplicates, reversing arrays. Typically O(n) time, O(1) space.', difficulty: 'MEDIUM' },
    { question: 'What is a heap data structure?', answer: 'Complete binary tree satisfying heap property. Max-heap: parent ≥ children. Min-heap: parent ≤ children. Operations: insert O(log n), delete-max/min O(log n), get-max/min O(1). Used in priority queues.', difficulty: 'MEDIUM' },
  ],
  'system-design': [
    { question: 'What is horizontal vs vertical scaling?', answer: 'Vertical (scale up): adding more resources to existing server (more CPU, RAM). Horizontal (scale out): adding more servers. Horizontal is preferred for high availability and handling large traffic.', difficulty: 'EASY' },
    { question: 'What is a CDN and how does it help?', answer: 'Content Delivery Network: distributed servers that deliver content from locations closer to users. Reduces latency, offloads origin server traffic, improves availability. Used for static assets, streaming.', difficulty: 'EASY' },
    { question: 'What is database sharding?', answer: 'Horizontal partitioning of database across multiple machines. Each shard holds subset of data. Strategies: range-based, hash-based, directory-based. Improves scalability but adds complexity.', difficulty: 'HARD' },
    { question: 'What is an event-driven architecture?', answer: 'Design pattern where components communicate via events. Producers emit events, consumers react asynchronously. Tools: Kafka, RabbitMQ, AWS SQS. Benefits: decoupling, scalability, resilience.', difficulty: 'MEDIUM' },
    { question: 'What is a message queue and why use it?', answer: 'Asynchronous communication mechanism allowing producers and consumers to work independently. Benefits: decoupling, buffer for traffic spikes, retry failed operations, fan-out messaging.', difficulty: 'MEDIUM' },
    { question: 'What is database indexing?', answer: 'Data structure (usually B-tree) that speeds up data retrieval at cost of additional storage and slower writes. Use on frequently queried columns. Composite indexes for multi-column queries.', difficulty: 'MEDIUM' },
    { question: 'What is caching and what strategies exist?', answer: 'Storing frequently accessed data in fast storage (Redis, Memcached). Strategies: Cache-aside, Write-through, Write-behind, Read-through. Challenges: cache invalidation, cache stampede, thundering herd.', hint: 'Think about what data to cache and when to invalidate it', difficulty: 'MEDIUM' },
    { question: 'What is a microservices architecture?', answer: 'Application built as collection of small, independent services. Each service: single responsibility, independently deployable, communicates via APIs. Benefits: scalability, tech diversity. Challenges: distributed system complexity.', difficulty: 'MEDIUM' },
    { question: 'What is the SOLID principle?', answer: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Design principles for maintainable, extensible OO software.', difficulty: 'MEDIUM' },
    { question: 'What is eventual consistency?', answer: 'Model where if no updates are made to data, eventually all replicas will converge to the same value. Trade-off: better availability and performance but reads may be stale. Used in DynamoDB, Cassandra.', difficulty: 'HARD' },
  ],
  'fullstack': [
    { question: 'What is the difference between REST and GraphQL?', answer: 'REST: multiple endpoints, server determines response shape, stateless. GraphQL: single endpoint, client specifies exact data needed, strongly typed schema. GraphQL solves over/under-fetching.', difficulty: 'MEDIUM' },
    { question: 'What is React\'s virtual DOM?', answer: 'Lightweight in-memory representation of the real DOM. React compares (reconciles) virtual DOM with previous version (diffing), then applies minimal changes to real DOM. Improves performance.', difficulty: 'MEDIUM' },
    { question: 'What is JWT (JSON Web Token)?', answer: 'Compact, URL-safe token for transmitting claims between parties. Structure: header.payload.signature (Base64 encoded). Stateless authentication — server doesn\'t store sessions. Vulnerable if secret leaked.', difficulty: 'MEDIUM' },
    { question: 'What is the difference between cookies and localStorage?', answer: 'Cookies: sent automatically with HTTP requests, can be HttpOnly/Secure/SameSite, 4KB limit, can expire. localStorage: JS only access, persists until cleared, 5-10MB, same-origin only.', difficulty: 'EASY' },
    { question: 'What is database normalization?', answer: 'Organizing database to reduce redundancy. 1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies. BCNF: stricter 3NF. Reduces anomalies but may need more JOINs.', difficulty: 'HARD' },
    { question: 'What is server-side rendering (SSR) vs client-side rendering (CSR)?', answer: 'SSR: HTML generated on server, better SEO, faster initial load. CSR: HTML generated in browser with JS, better interactivity after load, poor initial SEO. Next.js supports both + SSG.', difficulty: 'MEDIUM' },
    { question: 'What is a promise vs async/await in JavaScript?', answer: 'Promises: objects representing eventual completion/failure of async operation, chainable with .then()/.catch(). Async/await: syntactic sugar over promises, makes async code look synchronous, cleaner.', difficulty: 'EASY' },
    { question: 'What is CORS and why does it exist?', answer: 'Cross-Origin Resource Sharing: browser security mechanism restricting HTTP requests from different origins. Uses preflight OPTIONS request. Server must include Access-Control-Allow-Origin header.', difficulty: 'MEDIUM' },
    { question: 'What is the event loop in Node.js?', answer: 'Mechanism allowing Node.js to perform non-blocking I/O despite being single-threaded. Call stack + callback queue + microtask queue. Allows handling thousands of concurrent connections.', difficulty: 'HARD' },
    { question: 'What is a RESTful API?', answer: 'API following REST constraints: stateless, client-server, cacheable, layered, uniform interface (resources identified by URIs, HTTP methods: GET/POST/PUT/DELETE). Returns JSON/XML.', difficulty: 'EASY' },
  ],
}

const quizData: Record<string, { title: string; description: string; questions: Array<{ question: string; options: string[]; correctIndex: number; explanation: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD' }> }> = {
  'ai-ml': {
    title: 'AI & Machine Learning Fundamentals',
    description: 'Test your knowledge of core ML concepts',
    questions: [
      { question: 'Which activation function helps solve the vanishing gradient problem?', options: ['Sigmoid', 'Tanh', 'ReLU', 'Linear'], correctIndex: 2, explanation: 'ReLU (Rectified Linear Unit) does not saturate for positive values, helping gradients flow during backpropagation.', difficulty: 'MEDIUM' },
      { question: 'What does the "learning rate" control in gradient descent?', options: ['Size of the training dataset', 'Speed of GPU computation', 'Step size when updating weights', 'Number of hidden layers'], correctIndex: 2, explanation: 'The learning rate determines how much weights are adjusted with each update. Too high: diverge. Too low: very slow convergence.', difficulty: 'EASY' },
      { question: 'Which algorithm is used to train neural networks?', options: ['Forward propagation', 'Backpropagation', 'Random search', 'Simulated annealing'], correctIndex: 1, explanation: 'Backpropagation computes gradients by propagating the error backward through the network using chain rule.', difficulty: 'EASY' },
      { question: 'What is k-fold cross-validation?', options: ['Splitting data into k equal parts and training k models', 'Using k different learning rates', 'Having k hidden layers', 'Training for k epochs'], correctIndex: 0, explanation: 'K-fold CV divides data into k folds, trains k models each with a different fold as validation set, then averages results.', difficulty: 'MEDIUM' },
      { question: 'Which of the following is an unsupervised learning algorithm?', options: ['Linear regression', 'K-means clustering', 'Decision tree', 'Logistic regression'], correctIndex: 1, explanation: 'K-means clusters data without labeled examples. The others require labeled training data (supervised learning).', difficulty: 'EASY' },
      { question: 'What is dropout in neural networks?', options: ['Removing neurons below a threshold', 'Randomly deactivating neurons during training', 'Reducing learning rate', 'Removing outlier data points'], correctIndex: 1, explanation: 'Dropout randomly sets neuron outputs to zero during training. Acts as regularization to prevent overfitting.', difficulty: 'MEDIUM' },
      { question: 'What does LSTM stand for?', options: ['Large Scale Training Method', 'Long Short-Term Memory', 'Linear Sequential Training Model', 'Large Spatial Temporal Matrix'], correctIndex: 1, explanation: 'Long Short-Term Memory networks are a type of RNN designed to learn long-range dependencies using gates.', difficulty: 'MEDIUM' },
      { question: 'Which metric is best for imbalanced classification?', options: ['Accuracy', 'F1-score', 'Mean squared error', 'R-squared'], correctIndex: 1, explanation: 'F1-score (harmonic mean of precision and recall) is better than accuracy for imbalanced datasets where accuracy can be misleading.', difficulty: 'HARD' },
      { question: 'What is the purpose of the softmax function?', options: ['Binary classification output', 'Multi-class classification probabilities', 'Regression output', 'Feature normalization'], correctIndex: 1, explanation: 'Softmax converts raw scores (logits) to probability distribution summing to 1, used in multi-class classification output.', difficulty: 'MEDIUM' },
      { question: 'What is Principal Component Analysis (PCA)?', options: ['Classification algorithm', 'Dimensionality reduction technique', 'Clustering algorithm', 'Loss function'], correctIndex: 1, explanation: 'PCA transforms data to lower-dimensional space by projecting onto principal components (directions of maximum variance).', difficulty: 'HARD' },
    ],
  },
  'cybersecurity': {
    title: 'Cybersecurity Fundamentals',
    description: 'Test your cybersecurity knowledge',
    questions: [
      { question: 'Which HTTP header helps prevent XSS attacks?', options: ['Authorization', 'Content-Security-Policy', 'X-Frame-Options', 'Cache-Control'], correctIndex: 1, explanation: 'CSP header restricts what resources a browser can load, preventing malicious script injection.', difficulty: 'MEDIUM' },
      { question: 'What type of attack intercepts communications between two parties?', options: ['SQL Injection', 'XSS', 'Man-in-the-Middle', 'DoS'], correctIndex: 2, explanation: 'MITM attacks intercept and optionally modify communications. Prevented by TLS/SSL and certificate verification.', difficulty: 'EASY' },
      { question: 'What is a rainbow table attack?', options: ['Brute force all possible passwords', 'Pre-computed hash-to-password lookup table', 'Phishing via email', 'DDoS attack'], correctIndex: 1, explanation: 'Rainbow tables are pre-computed tables for reversing hash functions. Defeated by salting passwords before hashing.', difficulty: 'MEDIUM' },
      { question: 'Which authentication factor is "something you have"?', options: ['Password', 'Fingerprint', 'Hardware token', 'PIN'], correctIndex: 2, explanation: 'MFA factors: something you know (password), something you have (phone/token), something you are (biometric).', difficulty: 'EASY' },
      { question: 'What is the difference between IDS and IPS?', options: ['IDS is slower', 'IDS detects only, IPS detects and prevents', 'IPS is hardware only', 'No difference'], correctIndex: 1, explanation: 'IDS (Intrusion Detection System) monitors and alerts. IPS (Intrusion Prevention System) actively blocks threats.', difficulty: 'MEDIUM' },
      { question: 'What does SSL/TLS provide?', options: ['Encryption only', 'Authentication only', 'Encryption, authentication, and integrity', 'Availability'], correctIndex: 2, explanation: 'TLS provides: confidentiality (encryption), authentication (certificates), integrity (MAC). Foundation of HTTPS.', difficulty: 'EASY' },
      { question: 'What is social engineering?', options: ['Exploiting software bugs', 'Manipulating people to reveal confidential info', 'Network packet analysis', 'SQL database attack'], correctIndex: 1, explanation: 'Social engineering manipulates humans rather than technology. Examples: phishing, pretexting, baiting, quid pro quo.', difficulty: 'EASY' },
      { question: 'What is the purpose of a firewall?', options: ['Encrypt network traffic', 'Monitor and control network traffic based on rules', 'Speed up network connections', 'Store security logs'], correctIndex: 1, explanation: 'Firewalls filter network traffic using configured rules, blocking unauthorized access while allowing legitimate traffic.', difficulty: 'EASY' },
      { question: 'What is privilege escalation?', options: ['Increasing server resources', 'Gaining higher access rights than intended', 'Encrypting sensitive files', 'Tracking user behavior'], correctIndex: 1, explanation: 'Privilege escalation exploits vulnerabilities to gain elevated access. Horizontal: same level different user. Vertical: higher privilege level.', difficulty: 'MEDIUM' },
      { question: 'Which of these is NOT a symmetric encryption algorithm?', options: ['AES', 'DES', 'RSA', '3DES'], correctIndex: 2, explanation: 'RSA is asymmetric (public/private key pair). AES, DES, 3DES are all symmetric algorithms using the same key for encrypt/decrypt.', difficulty: 'MEDIUM' },
    ],
  },
  'cloud-devops': {
    title: 'Cloud & DevOps Essentials',
    description: 'Test your cloud and DevOps knowledge',
    questions: [
      { question: 'What command builds a Docker image?', options: ['docker run', 'docker build', 'docker create', 'docker compile'], correctIndex: 1, explanation: 'docker build -t myimage . reads the Dockerfile and creates a new image.', difficulty: 'EASY' },
      { question: 'What is a Kubernetes Pod?', options: ['A virtual machine', 'Smallest deployable unit, one or more containers', 'A Docker image', 'A load balancer'], correctIndex: 1, explanation: 'A Pod is Kubernetes\' smallest deployable unit, containing one or more containers sharing network and storage.', difficulty: 'EASY' },
      { question: 'What does AWS S3 stand for?', options: ['Simple Software Service', 'Simple Storage Service', 'Scalable Server System', 'Secure Storage Solution'], correctIndex: 1, explanation: 'S3 (Simple Storage Service) is AWS\'s object storage service for storing and retrieving any amount of data.', difficulty: 'EASY' },
      { question: 'What is a Kubernetes Service?', options: ['Pod management tool', 'Stable network endpoint for pods', 'Container runtime', 'Storage solution'], correctIndex: 1, explanation: 'Services provide stable IP and DNS names to access pods, which have dynamic IPs. Types: ClusterIP, NodePort, LoadBalancer.', difficulty: 'MEDIUM' },
      { question: 'What is the purpose of a Dockerfile?', options: ['Deploy to production', 'Define instructions to build a Docker image', 'Manage containers', 'Configure networking'], correctIndex: 1, explanation: 'Dockerfile contains step-by-step instructions (FROM, RUN, COPY, CMD, etc.) to build a Docker image.', difficulty: 'EASY' },
      { question: 'What is Terraform used for?', options: ['Container orchestration', 'Infrastructure as code', 'CI/CD pipelines', 'Monitoring'], correctIndex: 1, explanation: 'Terraform is an IaC tool for provisioning cloud infrastructure using declarative configuration files (HCL).', difficulty: 'MEDIUM' },
      { question: 'What is a rolling deployment?', options: ['Deploying on weekends', 'Gradually replacing old instances with new ones', 'Deploying to all servers at once', 'Reverting to previous version'], correctIndex: 1, explanation: 'Rolling deployment updates instances gradually, reducing risk and enabling zero-downtime deployments.', difficulty: 'MEDIUM' },
      { question: 'What is AWS EC2?', options: ['Email service', 'Elastic Compute Cloud — virtual servers', 'Database service', 'CDN service'], correctIndex: 1, explanation: 'EC2 (Elastic Compute Cloud) provides scalable virtual servers (instances) in the cloud. Choose instance type, OS, storage.', difficulty: 'EASY' },
      { question: 'What is a Kubernetes Deployment?', options: ['Single pod manager', 'Manages replicated pod rollouts and updates', 'Network policy', 'Storage class'], correctIndex: 1, explanation: 'Deployments manage desired state for pods: number of replicas, rolling updates, rollback capability.', difficulty: 'MEDIUM' },
      { question: 'What does "shift left" mean in DevOps?', options: ['Moving servers left in rack', 'Integrating testing/security earlier in development', 'Left-aligning code', 'Moving to on-premise'], correctIndex: 1, explanation: '"Shift left" means moving testing, security, and quality checks earlier in the development lifecycle to catch issues sooner.', difficulty: 'MEDIUM' },
    ],
  },
  'dsa': {
    title: 'DSA & Algorithms Challenge',
    description: 'Test your data structures knowledge',
    questions: [
      { question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'Arrays provide O(1) random access because elements are stored contiguously — just compute the memory address.', difficulty: 'EASY' },
      { question: 'Which data structure is used for BFS?', options: ['Stack', 'Queue', 'Priority Queue', 'Heap'], correctIndex: 1, explanation: 'BFS uses a queue (FIFO) to explore nodes level by level. DFS uses a stack (LIFO) or recursion.', difficulty: 'EASY' },
      { question: 'What is the time complexity of inserting into a sorted linked list?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 2, explanation: 'Finding the insertion position requires traversing the list — O(n). Insertion itself is O(1) once position is found.', difficulty: 'MEDIUM' },
      { question: 'Which sorting algorithm has best average-case performance for large datasets?', options: ['Bubble sort', 'Insertion sort', 'Merge sort', 'Selection sort'], correctIndex: 2, explanation: 'Merge sort guarantees O(n log n) in all cases. Quicksort also averages O(n log n) but worst case O(n²).', difficulty: 'MEDIUM' },
      { question: 'What is the space complexity of recursive DFS on a tree of height h?', options: ['O(1)', 'O(n)', 'O(h)', 'O(n log n)'], correctIndex: 2, explanation: 'Recursive DFS uses the call stack which goes as deep as the tree height h. For balanced tree h=O(log n).', difficulty: 'HARD' },
      { question: 'In which data structure is FIFO order maintained?', options: ['Stack', 'Queue', 'Binary tree', 'Hash map'], correctIndex: 1, explanation: 'Queue: First In, First Out (FIFO). Stack: Last In, First Out (LIFO). Used in BFS, task scheduling, etc.', difficulty: 'EASY' },
      { question: 'What is the average time complexity of QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1, explanation: 'QuickSort averages O(n log n) with good pivot selection. Worst case O(n²) with bad pivots (e.g., sorted array, naive pivot).', difficulty: 'MEDIUM' },
      { question: 'Which traversal visits nodes in sorted order in a BST?', options: ['Preorder', 'Postorder', 'Inorder', 'Level-order'], correctIndex: 2, explanation: 'Inorder traversal (left, root, right) of BST visits nodes in ascending sorted order.', difficulty: 'MEDIUM' },
      { question: 'What is memoization?', options: ['Memory optimization by compression', 'Caching results of expensive function calls', 'Memorizing algorithms', 'Stack memory management'], correctIndex: 1, explanation: 'Memoization caches results of function calls so repeated calls with same arguments return cached result instantly.', difficulty: 'MEDIUM' },
      { question: 'What is the difference between a tree and a graph?', options: ['No difference', 'Trees have cycles, graphs don\'t', 'Graphs have cycles, trees are acyclic and connected', 'Trees can have multiple roots'], correctIndex: 2, explanation: 'A tree is a connected, acyclic, undirected graph with n nodes and n-1 edges. Graphs can have cycles and disconnected components.', difficulty: 'MEDIUM' },
    ],
  },
  'system-design': {
    title: 'System Design Concepts',
    description: 'Test your system design knowledge',
    questions: [
      { question: 'What is the main benefit of a microservices architecture?', options: ['Easier debugging', 'Independent scaling and deployment', 'Single codebase', 'Faster development for small teams'], correctIndex: 1, explanation: 'Microservices allow independent scaling, deployment, and tech choices for each service. Trade-off: distributed system complexity.', difficulty: 'MEDIUM' },
      { question: 'What does CAP theorem state?', options: ['Can only have 2 of: Consistency, Availability, Partition tolerance', 'Can have all 3 with proper design', 'Applies only to relational databases', 'Only relevant for NoSQL systems'], correctIndex: 0, explanation: 'In distributed systems, during a network partition you must choose between consistency and availability. You always need partition tolerance.', difficulty: 'HARD' },
      { question: 'What is a database index?', options: ['A backup of database', 'Data structure speeding up data retrieval', 'Sorted copy of entire table', 'Encryption key'], correctIndex: 1, explanation: 'Indexes (usually B-trees) speed up read operations at the cost of additional storage and slower writes.', difficulty: 'EASY' },
      { question: 'What is the purpose of a message queue?', options: ['Store database queries', 'Asynchronous decoupled communication', 'Cache HTTP responses', 'Authenticate users'], correctIndex: 1, explanation: 'Message queues enable async communication, decoupling producers from consumers, buffering load spikes, and enabling retry logic.', difficulty: 'MEDIUM' },
      { question: 'What is a CDN used for?', options: ['Database caching', 'Serving content from servers geographically closer to users', 'User authentication', 'API rate limiting'], correctIndex: 1, explanation: 'CDNs cache and serve static content (images, CSS, JS, videos) from edge servers near users, reducing latency.', difficulty: 'EASY' },
      { question: 'What is database replication?', options: ['Deleting duplicate records', 'Copying data to multiple servers for redundancy', 'Normalizing database tables', 'Compressing database storage'], correctIndex: 1, explanation: 'Replication maintains copies of data on multiple servers for fault tolerance, read scaling, and geographic distribution.', difficulty: 'MEDIUM' },
      { question: 'What is the circuit breaker pattern?', options: ['Network security mechanism', 'Stopping calls to failing services to prevent cascade', 'Load balancing strategy', 'Database connection pooling'], correctIndex: 1, explanation: 'Circuit breaker detects failures and stops making requests to failing services, allowing recovery. States: Closed, Open, Half-Open.', difficulty: 'HARD' },
      { question: 'What is eventual consistency?', options: ['Data is always consistent', 'System guarantees data will converge given no updates', 'Transactions never fail', 'Only applies to SQL databases'], correctIndex: 1, explanation: 'Eventual consistency: if no new updates, all replicas will eventually converge. Trade-off for higher availability.', difficulty: 'HARD' },
      { question: 'What is horizontal partitioning (sharding)?', options: ['Splitting columns across tables', 'Splitting rows across multiple databases', 'Replicating full database', 'Archiving old data'], correctIndex: 1, explanation: 'Sharding splits data rows across multiple database instances. Each shard holds a subset. Enables horizontal scaling.', difficulty: 'HARD' },
      { question: 'What is a load balancer\'s primary function?', options: ['Cache database queries', 'Distribute traffic across multiple servers', 'Encrypt HTTP traffic', 'Monitor server health only'], correctIndex: 1, explanation: 'Load balancers distribute incoming requests across servers, ensuring no single server is overwhelmed and providing high availability.', difficulty: 'EASY' },
    ],
  },
  'fullstack': {
    title: 'Full Stack Web Development',
    description: 'Test your full stack knowledge',
    questions: [
      { question: 'What is the purpose of the virtual DOM in React?', options: ['Speed up CSS rendering', 'Efficient DOM updates by diffing', 'Server-side rendering', 'State management'], correctIndex: 1, explanation: 'React\'s virtual DOM is a lightweight copy. Changes are compared (diffed) and only actual changes are applied to real DOM.', difficulty: 'MEDIUM' },
      { question: 'What does HTTP status code 401 mean?', options: ['Not Found', 'Server Error', 'Unauthorized', 'Forbidden'], correctIndex: 2, explanation: '401 Unauthorized: authentication required but missing or invalid. 403 Forbidden: authenticated but not authorized. 404: not found.', difficulty: 'EASY' },
      { question: 'What is the difference between sessionStorage and localStorage?', options: ['No difference', 'sessionStorage clears on tab close, localStorage persists', 'localStorage is server-side', 'sessionStorage is larger'], correctIndex: 1, explanation: 'sessionStorage persists for session duration (tab close clears it). localStorage persists until explicitly cleared.', difficulty: 'EASY' },
      { question: 'What is a closure in JavaScript?', options: ['Closing a function', 'Function retaining access to its outer scope', 'Error handling mechanism', 'Type of loop'], correctIndex: 1, explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after that scope has returned.', difficulty: 'MEDIUM' },
      { question: 'What is the purpose of useEffect in React?', options: ['Create components', 'Handle side effects in functional components', 'Manage state', 'Define props'], correctIndex: 1, explanation: 'useEffect handles side effects (data fetching, subscriptions, DOM manipulation) in functional components. Replaces lifecycle methods.', difficulty: 'EASY' },
      { question: 'What is ACID in databases?', options: ['A JavaScript framework', 'Atomicity, Consistency, Isolation, Durability', 'API design principles', 'Async Control Iteration Design'], correctIndex: 1, explanation: 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent), Durability (persistent).', difficulty: 'MEDIUM' },
      { question: 'What is the box model in CSS?', options: ['JavaScript module system', 'Content, Padding, Border, Margin', 'Flexbox layout', 'Grid system'], correctIndex: 1, explanation: 'CSS box model: content (inner) → padding → border → margin (outer). box-sizing: border-box includes padding/border in width.', difficulty: 'EASY' },
      { question: 'What is CORS?', options: ['Code Review System', 'Cross-Origin Resource Sharing', 'Content Response Standard', 'Client-Origin Request Security'], correctIndex: 1, explanation: 'CORS is a browser security mechanism restricting cross-origin HTTP requests. Server must send appropriate Access-Control headers.', difficulty: 'MEDIUM' },
      { question: 'What does async/await do in JavaScript?', options: ['Multi-threading support', 'Syntactic sugar for working with Promises', 'Synchronizes multiple processes', 'Error handling'], correctIndex: 1, explanation: 'async/await makes Promise-based code look synchronous, improving readability. async function returns Promise; await pauses execution.', difficulty: 'EASY' },
      { question: 'What is the difference between == and === in JavaScript?', options: ['No difference', '=== checks value only, == checks type', '== checks value and type, === only value', '=== checks value and type, == performs type coercion'], correctIndex: 3, explanation: '=== (strict equality) checks both value AND type, no coercion. == performs type coercion before comparison. Always prefer ===.', difficulty: 'EASY' },
    ],
  },
}

const badges = [
  { name: '7-Day Streak', description: 'Study 7 days in a row', icon: '🔥', criteria: { type: 'streak', value: 7 } },
  { name: 'Quiz Master', description: 'Complete 10 quizzes', icon: '🏆', criteria: { type: 'quizzes', value: 10 } },
  { name: 'Speed Learner', description: 'Complete a quiz in under 3 minutes', icon: '⚡', criteria: { type: 'speed', value: 180 } },
  { name: 'Topic Explorer', description: 'Study at least 3 different topics', icon: '🗺️', criteria: { type: 'topics', value: 3 } },
  { name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '💯', criteria: { type: 'perfect', value: 100 } },
]

const interviewCategories = [
  { name: 'Frontend Engineer', slug: 'frontend-engineer' },
  { name: 'Backend Engineer', slug: 'backend-engineer' },
  { name: 'Full Stack Engineer', slug: 'fullstack-engineer' },
  { name: 'Data Scientist', slug: 'data-scientist' },
  { name: 'DevOps/SRE', slug: 'devops-sre' },
  { name: 'Cybersecurity Analyst', slug: 'cybersecurity-analyst' },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.activityLog.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.interviewSession.deleteMany()
  await prisma.interviewCategory.deleteMany()
  await prisma.quizAnswer.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.flashcardProgress.deleteMany()
  await prisma.flashcard.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.topicProgress.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleared existing data')

  // Create badges
  const createdBadges = await Promise.all(
    badges.map((b) => prisma.badge.create({ data: b }))
  )
  console.log('✅ Created badges')

  // Create interview categories
  await Promise.all(
    interviewCategories.map((c) => prisma.interviewCategory.create({ data: c }))
  )
  console.log('✅ Created interview categories')

  // Create topics
  const topicMap: Record<string, string> = {}
  for (const topic of topics) {
    const created = await prisma.topic.create({ data: { ...topic, status: 'PUBLISHED' } })
    topicMap[topic.slug] = created.id
    console.log(`  ✅ Topic: ${topic.name}`)

    // Create subtopics
    if (subtopics[topic.slug]) {
      for (const sub of subtopics[topic.slug]) {
        await prisma.topic.create({
          data: { ...sub, color: topic.color, parentId: created.id, status: 'PUBLISHED', order: 0 },
        })
      }
    }

    // Create flashcards
    if (flashcardData[topic.slug]) {
      await prisma.flashcard.createMany({
        data: flashcardData[topic.slug].map((fc, i) => ({
          topicId: created.id,
          question: fc.question,
          answer: fc.answer,
          hint: fc.hint || null,
          difficulty: fc.difficulty,
          order: i,
          status: 'PUBLISHED',
        })),
      })
      console.log(`  ✅ Flashcards for ${topic.name}`)
    }

    // Create quiz
    if (quizData[topic.slug]) {
      const qd = quizData[topic.slug]
      const quiz = await prisma.quiz.create({
        data: {
          topicId: created.id,
          title: qd.title,
          description: qd.description,
          timeLimit: 20,
          passingScore: 70,
          status: 'PUBLISHED',
        },
      })

      await prisma.quizQuestion.createMany({
        data: qd.questions.map((q, i) => ({
          quizId: quiz.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          difficulty: q.difficulty,
          order: i,
        })),
      })
      console.log(`  ✅ Quiz for ${topic.name}`)
    }
  }

  // Create admin user first (needed for resource uploadedBy)
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@skillforge.dev',
      passwordHash: adminPassword,
      role: 'ADMIN',
      level: 10,
      xp: 5000,
      streakDays: 30,
      lastActiveAt: new Date(),
    },
  })
  console.log('✅ Created admin user (admin@skillforge.dev / admin123)')

  // Create dummy resources for each topic
  const resourceData: Record<string, Array<{ title: string; description: string; type: 'PDF' | 'PPTX'; fileName: string }>> = {
    'ai-ml': [
      { title: 'Introduction to Machine Learning', description: 'Comprehensive guide covering supervised, unsupervised, and reinforcement learning fundamentals.', type: 'PDF', fileName: 'intro-to-ml.pdf' },
      { title: 'Deep Learning Slides', description: 'Lecture slides on neural networks, CNNs, RNNs, and transformer architectures.', type: 'PPTX', fileName: 'deep-learning-slides.pptx' },
    ],
    'cybersecurity': [
      { title: 'OWASP Top 10 Guide', description: 'Detailed breakdown of the OWASP Top 10 vulnerabilities with mitigation strategies.', type: 'PDF', fileName: 'owasp-top-10.pdf' },
      { title: 'Network Security Fundamentals', description: 'Slides covering firewalls, IDS/IPS, VPNs, and cryptography basics.', type: 'PPTX', fileName: 'network-security.pptx' },
    ],
    'cloud-devops': [
      { title: 'AWS Solutions Architect Notes', description: 'Study notes for AWS core services: EC2, S3, RDS, Lambda, VPC, IAM.', type: 'PDF', fileName: 'aws-architect-notes.pdf' },
      { title: 'Kubernetes & Docker Overview', description: 'Container orchestration concepts, Helm charts, and CI/CD pipeline design.', type: 'PPTX', fileName: 'kubernetes-docker.pptx' },
    ],
    'dsa': [
      { title: 'Big-O Cheat Sheet', description: 'Time and space complexity reference for all major data structures and algorithms.', type: 'PDF', fileName: 'big-o-cheatsheet.pdf' },
      { title: 'Dynamic Programming Patterns', description: 'Slides covering memoization, tabulation, and the 15 most common DP patterns.', type: 'PPTX', fileName: 'dp-patterns.pptx' },
    ],
    'system-design': [
      { title: 'System Design Interview Handbook', description: 'Step-by-step approach to designing scalable systems: estimation, components, trade-offs.', type: 'PDF', fileName: 'system-design-handbook.pdf' },
      { title: 'Distributed Systems Concepts', description: 'CAP theorem, consistency models, sharding, replication, and load balancing.', type: 'PPTX', fileName: 'distributed-systems.pptx' },
    ],
    'fullstack': [
      { title: 'React & Next.js Best Practices', description: 'Performance patterns, state management, SSR vs CSR, and deployment strategies.', type: 'PDF', fileName: 'react-nextjs-best-practices.pdf' },
      { title: 'REST vs GraphQL vs tRPC', description: 'API design comparison slides with real-world use cases and implementation examples.', type: 'PPTX', fileName: 'api-design-comparison.pptx' },
    ],
  }

  for (const [slug, resources] of Object.entries(resourceData)) {
    const topicId = topicMap[slug]
    if (!topicId) continue
    for (const r of resources) {
      await prisma.resource.create({
        data: {
          topicId,
          title: r.title,
          description: r.description,
          type: r.type,
          fileName: r.fileName,
          filePath: `/uploads/resources/${slug}/${r.fileName}`,
          fileSize: Math.floor(Math.random() * 4000000) + 500000,
          uploadedBy: admin.id,
          status: 'PUBLISHED',
          downloadCount: Math.floor(Math.random() * 120),
        },
      })
    }
  }
  console.log('✅ Created dummy resources')


  // Create demo student
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.create({
    data: {
      name: 'Demo Student',
      email: 'student@demo.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      level: 3,
      xp: 1250,
      streakDays: 5,
      lastActiveAt: new Date(),
    },
  })
  console.log('✅ Created demo student (student@demo.com / student123)')

  // Create topic progress for demo student across all topics
  const topicProgressData = [
    { slug: 'ai-ml',        mastery: 72, known: 7,  total: 10, quizzes: 2, avg: 75.0, time: 3600,  daysAgo: 0 },
    { slug: 'dsa',          mastery: 58, known: 5,  total: 10, quizzes: 1, avg: 60.0, time: 1800,  daysAgo: 1 },
    { slug: 'cybersecurity',mastery: 81, known: 9,  total: 10, quizzes: 3, avg: 83.0, time: 4200,  daysAgo: 2 },
    { slug: 'cloud-devops', mastery: 45, known: 4,  total: 10, quizzes: 1, avg: 50.0, time: 1200,  daysAgo: 3 },
    { slug: 'system-design',mastery: 63, known: 6,  total: 10, quizzes: 2, avg: 68.0, time: 2700,  daysAgo: 5 },
    { slug: 'fullstack',    mastery: 90, known: 10, total: 10, quizzes: 4, avg: 92.0, time: 6000,  daysAgo: 0 },
  ]

  for (const tp of topicProgressData) {
    const topicId = topicMap[tp.slug]
    if (!topicId) continue
    await prisma.topicProgress.create({
      data: {
        userId: student.id,
        topicId,
        masteryScore: tp.mastery,
        flashcardsKnown: tp.known,
        flashcardsTotal: tp.total,
        quizzesTaken: tp.quizzes,
        avgQuizScore: tp.avg,
        timeSpent: tp.time,
        lastAccessedAt: new Date(Date.now() - tp.daysAgo * 86400000),
      },
    })
  }

  // Create quiz attempts for demo student
  const quizAttemptData = [
    { slug: 'ai-ml',         score: 80, daysAgo: 0 },
    { slug: 'ai-ml',         score: 70, daysAgo: 3 },
    { slug: 'cybersecurity', score: 90, daysAgo: 1 },
    { slug: 'cybersecurity', score: 80, daysAgo: 4 },
    { slug: 'cybersecurity', score: 80, daysAgo: 6 },
    { slug: 'fullstack',     score: 100,daysAgo: 0 },
    { slug: 'fullstack',     score: 90, daysAgo: 2 },
    { slug: 'fullstack',     score: 90, daysAgo: 5 },
    { slug: 'fullstack',     score: 90, daysAgo: 7 },
    { slug: 'dsa',           score: 60, daysAgo: 1 },
    { slug: 'system-design', score: 70, daysAgo: 2 },
    { slug: 'system-design', score: 60, daysAgo: 6 },
    { slug: 'cloud-devops',  score: 50, daysAgo: 3 },
  ]

  for (const attempt of quizAttemptData) {
    const topicId = topicMap[attempt.slug]
    if (!topicId) continue
    const quiz = await prisma.quiz.findFirst({ where: { topicId } })
    if (!quiz) continue
    await prisma.quizAttempt.create({
      data: {
        userId: student.id,
        quizId: quiz.id,
        score: attempt.score,
        totalTime: Math.floor(Math.random() * 600) + 300,
        completedAt: new Date(Date.now() - attempt.daysAgo * 86400000),
      },
    })
  }
  console.log('✅ Created quiz attempts for demo student')

  // Give student multiple badges
  await prisma.userBadge.createMany({
    data: [
      { userId: student.id, badgeId: createdBadges[0].id, earnedAt: new Date(Date.now() - 7 * 86400000) },   // 7-Day Streak
      { userId: student.id, badgeId: createdBadges[1].id, earnedAt: new Date(Date.now() - 3 * 86400000) },   // Quiz Master
      { userId: student.id, badgeId: createdBadges[4].id, earnedAt: new Date(Date.now() - 10 * 86400000) },  // Topic Explorer
    ],
  })

  console.log('✅ Created topic progress and badges for demo student')
  console.log('')
  console.log('🎉 Seed complete!')
  console.log('')
  console.log('Credentials:')
  console.log('  Admin:   admin@skillforge.dev / admin123')
  console.log('  Student: student@demo.com / student123')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
