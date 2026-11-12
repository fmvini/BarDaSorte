import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";
import { Icon } from "../Icons.jsx";

const getCarouselConfig = (width) => {
  if (width < 560) {
    return { distance: 120, velocity: 500, x: 82, rotation: 7, scale: 0.08 };
  }
  if (width < 900) {
    return { distance: 160, velocity: 650, x: 112, rotation: 9, scale: 0.1 };
  }
  return { distance: 200, velocity: 800, x: 145, rotation: 11, scale: 0.12 };
};

function CarouselCard({ drink, index, total, progress, config }) {
  const offset = useTransform(progress, (value) => {
    let difference = (index - value) % total;
    if (difference > total / 2) difference -= total;
    if (difference < -total / 2) difference += total;
    return difference;
  });
  const x = useTransform(offset, (value) => value * config.x);
  const rotate = useTransform(offset, (value) => value * config.rotation);
  const scale = useTransform(
    offset,
    (value) => 1 - Math.abs(value) * config.scale,
  );
  const opacity = useTransform(
    offset,
    (value) => (Math.abs(value) <= 1 ? 1 : 0),
  );
  const pointerEvents = useTransform(offset, (value) =>
    Math.abs(value) <= 1 ? "auto" : "none",
  );
  const zIndex = useTransform(offset, (value) =>
    Math.round(100 - Math.abs(value) * 10),
  );
  const subtitle =
    drink.isAlcoholic === false
      ? "Sem álcool"
      : drink.category || "Uma receita para descobrir";

  return (
    <motion.div
      style={{ x, rotate, scale, opacity, pointerEvents, zIndex }}
      className="hero-carousel-card"
    >
      <Link to={`/drink/${drink.id}`} aria-label={`Ver receita de ${drink.name}`}>
        <img
          src={drink.image}
          alt={drink.name}
          loading="eager"
          decoding="async"
        />
        <div className="hero-carousel-caption">
          <strong>{drink.name}</strong>
          <span>{subtitle}</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function DrinkCarousel({ drinks }) {
  const slides = useMemo(() => drinks, [drinks]);
  const progress = useMotionValue(0);
  const startProgress = useRef(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const config = useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const preloadedImages = slides
      .filter((drink) => drink.image)
      .map((drink) => {
        const image = new Image();
        image.src = drink.image;
        return image;
      });

    return () => {
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [slides]);

  if (!slides.length) return null;

  const handleDragEnd = (_, info) => {
    const distanceShift = -info.offset.x / config.distance;
    const velocityShift = -info.velocity.x / config.velocity;
    const shift = Math.max(
      -3,
      Math.min(3, Math.round(distanceShift + velocityShift)),
    );
    animate(progress, Math.round(startProgress.current) + shift, {
      type: "spring",
      stiffness: 200,
      damping: 30,
    });
  };

  const move = (direction) => {
    animate(progress, Math.round(progress.get()) + direction, {
      type: "spring",
      stiffness: 200,
      damping: 30,
    });
  };

  return (
    <div className="hero-carousel" aria-label="Drinks em destaque">
      <button
        className="hero-carousel-arrow hero-carousel-arrow-left"
        type="button"
        onClick={() => move(-1)}
        aria-label="Drink anterior"
      >
        <Icon name="arrow" size={18} />
      </button>
      <motion.div
        className="hero-carousel-drag-surface"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => {
          startProgress.current = progress.get();
        }}
        onDrag={(_, info) => {
          progress.set(progress.get() - info.delta.x / 180);
        }}
        onDragEnd={handleDragEnd}
        aria-hidden="true"
      />
      {slides.map((drink, index) => (
        <CarouselCard
          key={drink.id}
          drink={drink}
          index={index}
          total={slides.length}
          progress={progress}
          config={config}
        />
      ))}
      <button
        className="hero-carousel-arrow hero-carousel-arrow-right"
        type="button"
        onClick={() => move(1)}
        aria-label="Próximo drink"
      >
        <Icon name="arrow" size={18} />
      </button>
    </div>
  );
}
