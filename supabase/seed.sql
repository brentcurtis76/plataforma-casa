-- Seed data for CASA church

-- Insert CASA organization
INSERT INTO church_organizations (id, name, slug, settings)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Comunidad Anglicana San André',
  'anglicanasanandre',
  '{
    "timezone": "America/Santiago",
    "currency": "CLP",
    "language": "es",
    "features": {
      "accounting": true,
      "presentations": true,
      "meditation": true
    }
  }'
);

-- Insert hero section
INSERT INTO church_hero_sections (organization_id, welcome_badge, headline, subheadline, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Bienvenido a CASA',
  'Un lugar donde el amor es incondicional',
  'Somos una comunidad inclusiva y acogedora donde todos son bienvenidos, sin importar su trasfondo, orientación o etapa de vida.',
  'Visítanos',
  '#contact',
  'Participar',
  '#participar'
);

-- Insert about section
INSERT INTO church_about_sections (organization_id, title, content)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Nuestro Propósito',
  'En CASA creemos que el amor de Dios es para todos, sin excepción. Somos una comunidad anglicana progresista que busca vivir el evangelio de manera relevante y transformadora en el siglo XXI.

Nuestros valores fundamentales incluyen:
• Inclusión radical: Todos son bienvenidos en nuestra mesa
• Justicia social: Trabajamos por un mundo más justo y equitativo
• Espiritualidad profunda: Cultivamos una relación auténtica con lo divino
• Comunidad solidaria: Nos apoyamos mutuamente en el camino de la vida'
);

-- Insert team members
INSERT INTO church_team_members (organization_id, name, role, bio, order_index)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rev. Brent Curtis', 'Rector', 'Sacerdote anglicano con más de 20 años de experiencia en ministerio inclusivo.', 1),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'María González', 'Directora de Música', 'Músico profesional dedicada a crear experiencias de adoración significativas.', 2),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carlos Rodríguez', 'Coordinador de Comunidad', 'Apasionado por crear espacios de encuentro y crecimiento espiritual.', 3);

-- Insert contact info
INSERT INTO church_contact_info (organization_id, address, phone, email, whatsapp, social_links)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Av. Principal 123, Santiago, Chile',
  '+56 9 4162 3577',
  'info@anglicanasanandre.cl',
  '+56941623577',
  '{
    "instagram": "https://instagram.com/casa_anglicana",
    "facebook": "https://facebook.com/casaanglicana",
    "youtube": "https://youtube.com/@casaanglicana"
  }'
);

-- Insert schedules
INSERT INTO church_schedules (organization_id, day_of_week, time, service_name, description)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 0, '10:30:00', 'Eucaristía Dominical', 'Celebración principal de la semana con comunión'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, '19:00:00', 'Oración Contemplativa', 'Espacio de silencio y meditación'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, '19:30:00', 'Estudio Bíblico', 'Exploración progresista de las escrituras');

-- Insert upcoming events
INSERT INTO church_events (organization_id, title, date, time, location, description, is_published)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Retiro de Semana Santa', '2025-04-18', '18:00:00', 'Centro de Retiros La Paz', 'Un fin de semana de reflexión y renovación espiritual.', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Concierto Benéfico', '2025-02-15', '20:00:00', 'Iglesia CASA', 'Música clásica y contemporánea para apoyar nuestros ministerios sociales.', true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Taller de Meditación', '2025-02-01', '10:00:00', 'Sala de Reuniones', 'Introducción a prácticas contemplativas cristianas.', true);