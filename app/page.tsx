"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css"; 

export default function Page() {
  const [theme, setTheme] = useState("light");
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <div className={styles.wrapper}>
      
      {/* ====== TOP NAV ====== */}
      <header className={styles.topnav}>
        <div className={styles.leftNav}>
          
          <button 
            className={styles.burgerBtn} 
            onClick={() => setOpenMenu(true)}
          >
            ☰
          </button>

          <div className={styles.logoBadge}>PC</div>
          <span className={styles.brandName}>My Rakitan ID</span>

          <nav className={styles.navLinks}>
            <span>Home</span>
            <span>Konfigurator PC</span>
            <span>Preset Builds</span>
            <span>Katalog Sparepart</span>
            <span>Support</span>
          </nav>
        </div>

        <div className={styles.rightNav}>
          <input className={styles.searchInput} placeholder="Cari komponen..." />
          <button className={styles.loginBtn}>Login</button>
        </div>
      </header>

      {openMenu && (
        <div 
          className={styles.backdrop} 
          onClick={() => setOpenMenu(false)}
        ></div>
      )}

      <aside className={`${styles.mobileSidebar} ${openMenu ? styles.openSidebar : ""}`}>
        <button className={styles.closeBtn} onClick={() => setOpenMenu(false)}>✕</button>

        <div className={styles.mobileMenuItems}>
          <span>Home</span>
          <span>Konfigurator PC</span>
          <span>Preset Builds</span>
          <span>Katalog Sparepart</span>
          <span>Support</span>
          <hr />
          <span>Login</span>
        </div>
      </aside>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Bangun PC Impian Anda</h1>
          <p>
            Konfigurator PC custom yang memudahkan Anda memilih komponen terbaik
            sesuai budget dan kebutuhan
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Mulai Build PC ➜</button>
            <button className={styles.secondaryBtn}>Lihat Preset Builds</button>
          </div>
        </div>

        <div className={styles.heroImage}></div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>

          <div>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoBadge}>PC</div>
              <h3>PC Builder</h3>
            </div>
            <p>
              Platform terpercaya untuk membangun PC custom sesuai kebutuhan Anda
              dengan komponen berkualitas terbaik.
            </p>
            <div className={styles.footerSocials}>
              <span>📘</span>
              <span>📸</span>
              <span>🐦</span>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Konfigurator PC</li>
              <li>Preset Builds</li>
              <li>Katalog Sparepart</li>
            </ul>
          </div>

          <div>
            <h4>Customer Service</h4>
            <ul>
              <li>FAQ</li>
              <li>Kontak Kami</li>
              <li>Garansi & Retur</li>
              <li>Track Order</li>
            </ul>
          </div>

          <div>
            <h4>Hubungi Kami</h4>
            <ul>
              <li>📍 Jl. Padjajaran No. 69, Bandung</li>
              <li>📞 +62 812-3456-7890</li>
              <li>✉️ support@MyRakitan.id</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          © 2024 My Rakitan ID. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
