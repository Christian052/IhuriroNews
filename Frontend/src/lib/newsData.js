let newsData = [
  {
    id: '1',
    title: 'Revolutionary AI Technology Transforms Healthcare Industry',
    content: `<h2>Breakthrough in Medical AI</h2>
    <p>The healthcare industry is experiencing a revolutionary transformation with the introduction of advanced AI technologies. Recent developments have shown unprecedented accuracy in diagnostic procedures, with AI systems now capable of detecting diseases earlier than traditional methods.</p>
    
    <h3>Key Innovations</h3>
    <ul>
      <li><strong>Predictive Analytics:</strong> AI algorithms can now predict patient outcomes with 95% accuracy</li>
      <li><strong>Image Recognition:</strong> Medical imaging enhanced by machine learning for better diagnosis</li>
      <li><strong>Drug Discovery:</strong> Accelerated pharmaceutical research reducing development time by 40%</li>
    </ul>
    
    <p>Healthcare professionals worldwide are embracing these technologies, leading to improved patient care and more efficient treatment protocols. The integration of AI in healthcare represents a significant step forward in medical science.</p>
    
    <blockquote>
      "This technology is not just improving healthcare; it's revolutionizing how we approach patient care and medical research." - Dr. Sarah Johnson, Chief Medical Officer
    </blockquote>`,
    author: 'Dr. Sarah Johnson',
    category: 'Technology',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: '5 min read',
    views: 1247
  },
  {
    id: '2',
    title: 'Global Markets Show Strong Recovery After Economic Uncertainty',
    content: `<h2>Market Resilience in Challenging Times</h2>
    <p>Financial markets worldwide have demonstrated remarkable resilience, showing strong recovery patterns following a period of economic uncertainty. Key indicators suggest sustained growth across multiple sectors.</p>
    
    <h3>Performance Highlights</h3>
    <ul>
      <li><strong>Stock Markets:</strong> Major indices up 12% over the past quarter</li>
      <li><strong>Employment:</strong> Unemployment rates decreased to pre-pandemic levels</li>
      <li><strong>Consumer Confidence:</strong> Rising trends in retail and service sectors</li>
    </ul>
    
    <p>Analysts attribute this positive trend to strategic policy implementations and increased investor confidence. The technology and renewable energy sectors continue to lead market growth.</p>
    
    <h3>Looking Forward</h3>
    <p>Economic forecasts remain optimistic, with projected growth rates exceeding initial estimates. However, experts advise cautious monitoring of global trade dynamics and inflation trends.</p>`,
    author: 'Michael Chen',
    category: 'Finance',
    status: 'published',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    readTime: '4 min read',
    views: 892
  },
  {
    id: '3',
    title: 'Climate Action Summit Produces Groundbreaking Environmental Agreements',
    content: `<h2>Historic Climate Commitments</h2>
    <p>The recent Climate Action Summit has resulted in unprecedented international cooperation, with participating nations committing to ambitious environmental targets that could reshape global climate policy.</p>
    
    <h3>Major Agreements</h3>
    <ul>
      <li><strong>Carbon Neutrality:</strong> 50+ countries pledge net-zero emissions by 2040</li>
      <li><strong>Renewable Energy:</strong> $500 billion investment in clean energy infrastructure</li>
      <li><strong>Conservation:</strong> Protection of 30% of global land and ocean areas</li>
    </ul>
    
    <p>These agreements represent the most significant climate action commitments in decades, with binding targets and regular progress reviews.</p>
    
    <h3>Implementation Strategy</h3>
    <p>The summit outlined a comprehensive implementation framework including technology sharing, financial support for developing nations, and innovative green technology initiatives.</p>
    
    <blockquote>
      "Today's agreements mark a turning point in our collective fight against climate change. The future of our planet depends on the actions we take now." - UN Climate Chief
    </blockquote>`,
    author: 'Emma Rodriguez',
    category: 'Environment',
    status: 'published',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    readTime: '6 min read',
    views: 1563
  }
];

export const getNewsData = () => {
  return [...newsData];
};

export const updateNewsPost = (post) => {
  const existingIndex = newsData.findIndex(p => p.id === post.id);
  if (existingIndex !== -1) {
    newsData[existingIndex] = post;
  } else {
    newsData.unshift(post);
  }
};

export const deleteNewsPost = (postId) => {
  newsData = newsData.filter(post => post.id !== postId);
};