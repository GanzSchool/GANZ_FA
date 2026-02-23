DROP TABLE IF EXISTS diakok;

CREATE TABLE diakok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(255) NOT NULL,
  oktatasiazonosito VARCHAR(50) UNIQUE NOT NULL,
  anyjaneve VARCHAR(255),
  szuletesidatum DATE NOT NULL,
  jelszo VARCHAR(255) NOT NULL,

  het_irodalom VARCHAR(5),
  het_magyarnyelv VARCHAR(5),
  het_matematika VARCHAR(5),
  het_tortenelem VARCHAR(5),
  het_idegennyelv VARCHAR(5),
  het_fizika VARCHAR(5),
  het_technika VARCHAR(5),

  nyolc_irodalom VARCHAR(5),
  nyolc_magyarnyelv VARCHAR(5),
  nyolc_matematika VARCHAR(5),
  nyolc_tortenelem VARCHAR(5),
  nyolc_idegennyelv VARCHAR(5),
  nyolc_fizika VARCHAR(5),
  nyolc_technika VARCHAR(5),

  kozponti_pontok INT,
  magyar_pontok INT,
  matematika_pontok INT,
  nyelvi_szintfelmeres VARCHAR(10),
  ganziskola_ismerkedesi_pontok INT,
  osszespont INT,

  megjelolt_kepzes_1 VARCHAR(255),
  megjelolt_kepzes_2 VARCHAR(255),
  megjelolt_kepzes_3 VARCHAR(255),

  rangsor_kepzes_1 VARCHAR(255),
  rangsor_helyezes_1 INT,
  rangsor_kepzes_2 VARCHAR(255),
  rangsor_helyezes_2 INT,

  felvett_kepzes VARCHAR(255),
  nem_felvett_kepzes VARCHAR(255),

  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modositva TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO diakok (
  nev, oktatasiazonosito, anyjaneve, szuletesidatum, jelszo,
  het_irodalom, het_magyarnyelv, het_matematika, het_tortenelem, het_idegennyelv, het_fizika, het_technika,
  nyolc_irodalom, nyolc_magyarnyelv, nyolc_matematika, nyolc_tortenelem, nyolc_idegennyelv, nyolc_fizika, nyolc_technika,
  kozponti_pontok, magyar_pontok, matematika_pontok, nyelvi_szintfelmeres, ganziskola_ismerkedesi_pontok, osszespont,
  megjelolt_kepzes_1, megjelolt_kepzes_2, megjelolt_kepzes_3,
  rangsor_kepzes_1, rangsor_helyezes_1, rangsor_kepzes_2, rangsor_helyezes_2,
  felvett_kepzes, nem_felvett_kepzes
)
VALUES
-- 1. diák – a példában szereplő
(
  'Gipsz Jakab', '72111111111', 'Anyuka', '2000-01-01', '2000-01-01',
  '4', '4', '4', '4', '-', '4', '3',
  '4', '4', '4', '4', '4', '4', '-',
  61, 32, 29, '83%', 14, 122,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus', 3,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus', 5,
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus'
),

-- 2. diák
(
  'Kiss Péter', '72111111112', 'Kiss Mária', '2000-02-15', '2000-02-15',
  '5', '5', '4', '4', '4', '5', '4',
  '5', '5', '4', '4', '4', '5', '4',
  70, 36, 34, '90%', 18, 142,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus', 4,
  NULL, NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  NULL
),

-- 3. diák
(
  'Szabó Anna', '72111111113', 'Szabó Julianna', '2000-03-10', '2000-03-10',
  '4', '5', '5', '4', '4', '4', '5',
  '5', '5', '5', '4', '4', '5', '5',
  75, 40, 35, '88%', 16, 151,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány',
  NULL,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás', 2,
  NULL, NULL,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  NULL
),

-- 4. diák
(
  'Nagy Dániel', '72111111114', 'Nagy Ilona', '2000-04-05', '2000-04-05',
  '3', '4', '4', '3', '3', '4', '3',
  '4', '4', '4', '3', '3', '4', '3',
  55, 28, 27, '75%', 10, 110,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány',
  NULL,
  NULL,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány', 10,
  NULL, NULL,
  NULL,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány'
),

-- 5. diák
(
  'Tóth Lilla', '72111111115', 'Tóth Zsuzsanna', '2000-05-20', '2000-05-20',
  '5', '5', '5', '5', '5', '5', '5',
  '5', '5', '5', '5', '5', '5', '5',
  80, 40, 40, '95%', 20, 175,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás', 1,
  NULL, NULL,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  NULL
),

-- 6. diák
(
  'Farkas Bence', '72111111116', 'Farkas Erika', '2000-06-30', '2000-06-30',
  '4', '4', '3', '4', '3', '4', '4',
  '4', '4', '3', '4', '3', '4', '4',
  60, 30, 30, '82%', 12, 132,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  NULL,
  NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus', 6,
  NULL, NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  NULL
),

-- 7. diák
(
  'Horváth Eszter', '72111111117', 'Horváth Ágnes', '2000-07-11', '2000-07-11',
  '5', '4', '5', '5', '4', '5', '4',
  '5', '4', '5', '5', '4', '5', '4',
  72, 38, 34, '89%', 15, 145,
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  NULL,
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus', 2,
  NULL, NULL,
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  NULL
),

-- 8. diák
(
  'Varga Márk', '72111111118', 'Varga Edit', '2000-08-09', '2000-08-09',
  '3', '3', '4', '3', '-', '3', '3',
  '3', '3', '4', '3', '-', '3', '3',
  50, 25, 25, '70%', 8, 100,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány',
  NULL,
  NULL,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány', 15,
  NULL, NULL,
  NULL,
  '0104 technikum, 5 évfolyam, Gépész technikus CAD-CAM szakmairány'
),

-- 9. diák
(
  'Balogh Réka', '72111111119', 'Balogh Mónika', '2000-09-21', '2000-09-21',
  '4', '5', '4', '5', '4', '4', '5',
  '4', '5', '4', '5', '4', '4', '5',
  68, 34, 34, '87%', 13, 140,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  NULL,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás', 3,
  NULL, NULL,
  '0101 technikum, angol nyelvi előkészítő + 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás',
  NULL
),

-- 10. diák
(
  'Molnár Gergő', '72111111120', 'Molnár Katalin', '2000-10-12', '2000-10-12',
  '4', '4', '4', '4', '3', '4', '4',
  '4', '4', '4', '4', '3', '4', '4',
  62, 31, 31, '80%', 11, 133,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  '0102 technikum, 5 évfolyam, magyar - angol két tanítási nyelvű iskolai oktatás, szoftverfejlesztő és -tesztelő technikus',
  NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus', 5,
  NULL, NULL,
  '0103 technikum, 5 évfolyam, szoftverfejlesztő és -tesztelő technikus',
  NULL
);

