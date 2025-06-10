<template>
  <div class="about-container">
    <div class="about-header">
      <h1>关于我们</h1>
      <p>传承中华文化，弘扬国学精神</p>
    </div>
    
    <div class="about-content">
      <tiny-card class="about-section">
        <h2>网站简介</h2>
        <p>国学经典学习网站致力于传播和弘扬中国传统文化，为广大国学爱好者提供一个系统学习、交流探讨的平台。本网站收录了丰富的国学经典著作，包括四书五经、诸子百家等，并提供原文、注释、译文等多种学习资料，帮助用户更好地理解和掌握国学经典内容。</p>
      </tiny-card>
      
      <tiny-card class="about-section">
        <h2>我们的使命</h2>
        <p>在当今全球化的时代背景下，中华优秀传统文化的传承和发展显得尤为重要。我们的使命是通过数字化手段，将国学经典以更加现代、便捷的方式呈现给用户，让更多人能够接触、了解、学习中国传统文化的精髓，从而增强文化自信，汲取古人智慧，指导现代生活。</p>
      </tiny-card>
      
      <tiny-card class="about-section">
        <h2>核心理念</h2>
        <tiny-row :gutter="20" class="values-row">
          <tiny-col :span="8">
            <div class="value-item">
              <tiny-icon name="reading" size="40px" color="#409EFF"></tiny-icon>
              <h3>尊重经典</h3>
              <p>尊重原著，精准校对，确保内容的权威性和准确性</p>
            </div>
          </tiny-col>
          <tiny-col :span="8">
            <div class="value-item">
              <tiny-icon name="user" size="40px" color="#409EFF"></tiny-icon>
              <h3>以用户为中心</h3>
              <p>关注用户体验，提供友好的界面和丰富的功能</p>
            </div>
          </tiny-col>
          <tiny-col :span="8">
            <div class="value-item">
              <tiny-icon name="share" size="40px" color="#409EFF"></tiny-icon>
              <h3>开放共享</h3>
              <p>鼓励知识分享，构建活跃的学习社区</p>
            </div>
          </tiny-col>
        </tiny-row>
      </tiny-card>
      
      <tiny-card class="about-section">
        <h2>联系我们</h2>
        <p>如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：</p>
        <div class="contact-info">
          <p><tiny-icon name="message"></tiny-icon> 邮箱：contact@guoxue-classic.com</p>
          <p><tiny-icon name="phone"></tiny-icon> 电话：010-12345678</p>
          <p><tiny-icon name="location"></tiny-icon> 地址：北京市海淀区中关村南大街5号</p>
        </div>
      </tiny-card>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.about-header p {
  font-size: 1.2rem;
  color: #666;
}

.about-section {
  margin-bottom: 30px;
}

.about-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  font-family: 'STKaiti', 'KaiTi', serif;
  position: relative;
  padding-bottom: 10px;
}

.about-section h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #409EFF;
}

.about-section p {
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
}

.values-row {
  margin-top: 20px;
}

.value-item {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  height: 100%;
}

.value-item h3 {
  font-size: 1.3rem;
  margin: 15px 0 10px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.value-item p {
  font-size: 0.95rem;
  color: #666;
}

.contact-info {
  margin-top: 20px;
}

.contact-info p {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.contact-info .tiny-icon {
  margin-right: 10px;
  color: #409EFF;
}

@media (max-width: 768px) {
  .value-item {
    margin-bottom: 20px;
  }
}
</style>
