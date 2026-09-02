---
title: SafeLift - Aerial Work Platform Equipment
date: 2026-09-03
---

<!-- 英雄图 + 标题 -->
<div style="background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba') center/cover no-repeat; height: 80vh; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
  <div>
    <h1 style="font-size: 4rem; margin-bottom: 1rem;">SafeLift</h1>
    <h2 style="font-size: 2.2rem;">Leading Aerial Work Platform Equipment Manufacturer</h2>
    <p style="font-size: 1.3rem;">Boom Lifts • Scissor Lifts • Vertical Platforms • Spider Lifts</p>
    <a href="#products" style="background: #ff6600; color: white; padding: 15px 50px; border-radius: 30px; text-decoration: none; font-size: 1.2rem; display: inline-block; margin-top: 30px;">View Products</a>
  </div>
</div>

<!-- 产品展示网格 -->
<section id="products" style="padding: 80px 20px; background: #f8f9fa;">
  <div class="container" style="max-width: 1200px;">
    <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.8rem;">Our Products</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
      
      <div onclick="showDetail('boom')" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer;">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd30" style="width: 100%; height: 220px; object-fit: cover;">
        <div style="padding: 20px;">
          <h3 style="margin: 0;">Boom Lift</h3>
          <p style="color: #666;">Telescopic • Articulated • Max height 25m</p>
          <button onclick="event.stopImmediatePropagation(); showDetail('boom');" style="background: #ff6600; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px;">Details</button>
        </div>
      </div>

      <div onclick="showDetail('scissor')" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer;">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd" style="width: 100%; height: 220px; object-fit: cover;">
        <div style="padding: 20px;">
          <h3 style="margin: 0;">Scissor Lift</h3>
          <p style="color: #666;">Electric • Max height 10m • 500kg</p>
          <button onclick="event.stopImmediatePropagation(); showDetail('scissor');" style="background: #ff6600; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px;">Details</button>
        </div>
      </div>

      <div onclick="showDetail('vertical')" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer;">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd30" style="width: 100%; height: 220px; object-fit: cover;">
        <div style="padding: 20px;">
          <h3 style="margin: 0;">Vertical Platform</h3>
          <p style="color: #666;">Max height 15m • Narrow space ready</p>
          <button onclick="event.stopImmediatePropagation(); showDetail('vertical');" style="background: #ff6600; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px;">Details</button>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- 详情浮层 -->
<div id="detail-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center;">
  <div style="background: white; width: 90%; max-width: 800px; border-radius: 12px; padding: 30px; color: black; position: relative;">
    <h2 id="modal-title" style="margin-top: 0;"></h2>
    <img id="modal-image" style="width: 100%; height: 300px; object-fit: cover; margin: 20px 0;">
    <p id="modal-desc" style="line-height: 1.6;"></p>
    <button onclick="closeModal()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 30px;">Close</button>
  </div>
</div>

<script>
function showDetail(type) {
  const details = {
    boom: { title: 'Boom Lift', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd30', desc: 'Telescopic, articulated and towable boom lifts. Max working height up to 25m. Electric or diesel options.' },
    scissor: { title: 'Scissor Lift', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd', desc: 'Electric scissor lifts. Max height 10m, load capacity 500kg.' },
    vertical: { title: 'Vertical Platform', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd30', desc: 'Vertical mast lifts. Max height 15m. Great for tight spaces.' }
  };
  document.getElementById('modal-title').innerHTML = details[type].title;
  document.getElementById('modal-image').src = details[type].img;
  document.getElementById('modal-desc').innerHTML = details[type].desc;
  document.getElementById('detail-modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('detail-modal').style.display = 'none';
}
</script>