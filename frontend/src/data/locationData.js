// Datos para los selectores de ubicación

// Lista de países (solo España)
export const countries = [
  { code: 'ES', name: 'España' }
];

// Provincias de España
export const provinces = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba',
  'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
  'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 
  'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
  'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
  'Zamora', 'Zaragoza'
];

// Ciudades por provincia (ampliado con más ciudades)
export const cities = {
  'A Coruña': ['A Coruña', 'Arteixo', 'Ames', 'Betanzos', 'Boiro', 'Carballo', 'Cedeira', 'Cee', 'Culleredo', 'Ferrol', 'Melide', 'Narón', 'Noia', 'Oleiros', 'Ordes', 'Ribeira', 'Sada', 'Santiago de Compostela'],
  'Álava': ['Vitoria-Gasteiz', 'Amurrio', 'Laudio/Llodio', 'Salvatierra/Agurain', 'Oyón-Oion', 'Iruña de Oca', 'Alegría-Dulantzi', 'Artziniega', 'Asparrena', 'Ayala/Aiara'],
  'Albacete': ['Albacete', 'Hellín', 'Villarrobledo', 'Almansa', 'La Roda', 'Caudete', 'Tobarra', 'Casas-Ibáñez', 'Chinchilla de Monte-Aragón', 'Madrigueras'],
  'Alicante': ['Alicante', 'Alcoy', 'Benidorm', 'Elche', 'Elda', 'Orihuela', 'Torrevieja', 'Villena', 'Calpe', 'Crevillente', 'Dénia', 'Javea', 'Santa Pola', 'San Vicente del Raspeig', 'Novelda'],
  'Almería': ['Almería', 'Adra', 'El Ejido', 'Níjar', 'Roquetas de Mar', 'Vícar', 'Huércal-Overa', 'Vera', 'Cuevas del Almanzora', 'Berja'],
  'Asturias': ['Oviedo', 'Gijón', 'Avilés', 'Langreo', 'Mieres', 'Siero', 'Corvera de Asturias', 'Castrillón', 'San Martín del Rey Aurelio', 'Villaviciosa', 'Cangas de Onís', 'Llanes', 'Laviana', 'Valdés', 'Tineo'],
  'Ávila': ['Ávila', 'Arévalo', 'Arenas de San Pedro', 'Las Navas del Marqués', 'Candeleda', 'El Tiemblo', 'Sotillo de la Adrada', 'Piedrahíta', 'El Barco de Ávila', 'La Adrada'],
  'Badajoz': ['Badajoz', 'Mérida', 'Don Benito', 'Almendralejo', 'Villanueva de la Serena', 'Zafra', 'Montijo', 'Jerez de los Caballeros', 'Villafranca de los Barros', 'Olivenza'],
  'Barcelona': ['Barcelona', 'Badalona', 'Castelldefels', 'Cornellà de Llobregat', 'El Prat de Llobregat', 'Esplugues de Llobregat', 'Gavà', 'Granollers', 'L\'Hospitalet de Llobregat', 'Igualada', 'Manresa', 'Mataró', 'Mollet del Vallès', 'Montcada i Reixac', 'Ripollet', 'Rubí', 'Sabadell', 'Sant Adrià de Besòs', 'Sant Boi de Llobregat', 'Sant Cugat del Vallès', 'Sant Feliu de Llobregat', 'Santa Coloma de Gramenet', 'Terrassa', 'Vic', 'Vilafranca del Penedès', 'Vilanova i la Geltrú'],
  'Burgos': ['Burgos', 'Aranda de Duero', 'Miranda de Ebro', 'Briviesca', 'Medina de Pomar', 'Lerma', 'Villarcayo', 'Salas de los Infantes', 'Roa', 'Belorado'],
  'Cáceres': ['Cáceres', 'Plasencia', 'Navalmoral de la Mata', 'Coria', 'Trujillo', 'Moraleja', 'Miajadas', 'Jaraíz de la Vera', 'Montehermoso', 'Valencia de Alcántara'],
  'Cádiz': ['Cádiz', 'Algeciras', 'Arcos de la Frontera', 'Barbate', 'Chiclana de la Frontera', 'Conil de la Frontera', 'El Puerto de Santa María', 'Jerez de la Frontera', 'La Línea de la Concepción', 'Los Barrios', 'Puerto Real', 'Rota', 'San Fernando', 'San Roque', 'Sanlúcar de Barrameda', 'Tarifa', 'Ubrique', 'Vejer de la Frontera'],
  'Cantabria': ['Santander', 'Torrelavega', 'Castro-Urdiales', 'Camargo', 'Piélagos', 'Astillero', 'Laredo', 'Santa Cruz de Bezana', 'Santoña', 'Corrales de Buelna', 'Reinosa', 'San Vicente de la Barquera', 'Cabezón de la Sal', 'Colindres', 'Comillas'],
  'Castellón': ['Castellón de la Plana', 'Vila-real', 'Burriana', 'La Vall d\'Uixó', 'Benicarló', 'Vinaròs', 'Almassora', 'Onda', 'Benicàssim', 'Oropesa del Mar', 'Nules', 'Peñíscola', 'Alcora', 'Torreblanca', 'Segorbe'],
  'Ciudad Real': ['Ciudad Real', 'Puertollano', 'Tomelloso', 'Valdepeñas', 'Alcázar de San Juan', 'Manzanares', 'Daimiel', 'La Solana', 'Bolaños de Calatrava', 'Campo de Criptana', 'Socuéllamos', 'Miguelturra', 'Almadén', 'Almagro', 'Villarrubia de los Ojos'],
  'Córdoba': ['Córdoba', 'Lucena', 'Puente Genil', 'Montilla', 'Priego de Córdoba', 'Cabra', 'Baena', 'Palma del Río', 'Pozoblanco', 'Peñarroya-Pueblonuevo', 'Villanueva de Córdoba', 'Rute', 'Aguilar de la Frontera', 'Fernán-Núñez', 'Bujalance'],
  'Cuenca': ['Cuenca', 'Tarancón', 'Motilla del Palancar', 'San Clemente', 'Quintanar del Rey', 'Mota del Cuervo', 'Las Pedroñeras', 'Horcajo de Santiago', 'Huete', 'Villalba del Rey'],
  'Girona': ['Girona', 'Figueres', 'Blanes', 'Lloret de Mar', 'Olot', 'Salt', 'Palafrugell', 'Sant Feliu de Guíxols', 'Roses', 'Banyoles', 'Palamós', 'Torroella de Montgrí', 'Santa Coloma de Farners', 'Ripoll', 'La Bisbal d\'Empordà'],
  'Granada': ['Granada', 'Motril', 'Almuñécar', 'Baza', 'Loja', 'Guadix', 'Armilla', 'Maracena', 'Albolote', 'Salobreña', 'Las Gabias', 'La Zubia', 'Santa Fe', 'Huéscar', 'Atarfe'],
  'Guadalajara': ['Guadalajara', 'Azuqueca de Henares', 'Alovera', 'El Casar', 'Cabanillas del Campo', 'Sigüenza', 'Villanueva de la Torre', 'Molina de Aragón', 'Trillo', 'Yunquera de Henares'],
  'Guipúzcoa': ['San Sebastián', 'Irún', 'Errenteria', 'Eibar', 'Zarautz', 'Arrasate/Mondragón', 'Hernani', 'Tolosa', 'Lasarte-Oria', 'Hondarribia', 'Bergara', 'Andoain', 'Azpeitia', 'Beasain', 'Azkoitia'],
  'Huelva': ['Huelva', 'Lepe', 'Almonte', 'Isla Cristina', 'Ayamonte', 'Moguer', 'Cartaya', 'Punta Umbría', 'Bollullos Par del Condado', 'Valverde del Camino', 'La Palma del Condado', 'Aljaraque', 'Gibraleón', 'Aracena', 'Nerva'],
  'Huesca': ['Huesca', 'Barbastro', 'Monzón', 'Jaca', 'Fraga', 'Sabiñánigo', 'Binéfar', 'Sariñena', 'Graus', 'Tamarite de Litera'],
  'Islas Baleares': ['Palma de Mallorca', 'Calvià', 'Ibiza', 'Mahón', 'Manacor', 'Santa Eulària des Riu', 'Llucmajor', 'Ciutadella de Menorca', 'Marratxí', 'Inca', 'Eivissa', 'Sant Antoni de Portmany', 'Sant Josep de sa Talaia', 'Sóller', 'Alcúdia', 'Santa Margalida', 'Felanitx', 'Pollença', 'Andratx', 'Sant Llorenç des Cardassar', 'Campos', 'Capdepera', 'Santanyí', 'Son Servera', 'Artà'],
  'Jaén': ['Jaén', 'Linares', 'Andújar', 'Úbeda', 'Martos', 'Alcalá la Real', 'Bailén', 'Baeza', 'La Carolina', 'Torre del Campo', 'Villacarrillo', 'Jódar', 'Mengíbar', 'Mancha Real', 'Torredonjimeno'],
  'La Rioja': ['Logroño', 'Calahorra', 'Arnedo', 'Haro', 'Alfaro', 'Lardero', 'Nájera', 'Santo Domingo de la Calzada', 'Villamediana de Iregua', 'Autol'],
  'Las Palmas': ['Las Palmas de Gran Canaria', 'Telde', 'Arucas', 'Santa Lucía de Tirajana', 'San Bartolomé de Tirajana', 'Arrecife', 'Puerto del Rosario', 'Ingenio', 'Agüimes', 'Gáldar', 'Santa María de Guía', 'La Oliva', 'Mogán', 'Teguise', 'Antigua'],
  'León': ['León', 'Ponferrada', 'San Andrés del Rabanedo', 'Villaquilambre', 'Astorga', 'La Bañeza', 'Bembibre', 'Valencia de Don Juan', 'Villablino', 'La Robla', 'Cistierna', 'Cacabelos', 'Fabero', 'Sahagún', 'Benavides'],
  'Lleida': ['Lleida', 'Balaguer', 'Tàrrega', 'Mollerussa', 'La Seu d\'Urgell', 'Cervera', 'Alcarràs', 'Almacelles', 'Solsona', 'Les Borges Blanques', 'Alpicat', 'Guissona', 'Tremp', 'Agramunt', 'Bellpuig'],
  'Lugo': ['Lugo', 'Monforte de Lemos', 'Viveiro', 'Vilalba', 'Sarria', 'Ribadeo', 'Foz', 'Burela', 'Chantada', 'Guitiriz'],
  'Madrid': ['Madrid', 'Alcalá de Henares', 'Alcobendas', 'Alcorcón', 'Algete', 'Arganda del Rey', 'Arroyomolinos', 'Boadilla del Monte', 'Ciempozuelos', 'Collado Villalba', 'Colmenar Viejo', 'Coslada', 'Fuenlabrada', 'Galapagar', 'Getafe', 'Leganés', 'Majadahonda', 'Móstoles', 'Navalcarnero', 'Parla', 'Pinto', 'Pozuelo de Alarcón', 'Rivas-Vaciamadrid', 'Las Rozas de Madrid', 'San Fernando de Henares', 'San Sebastián de los Reyes', 'Torrejón de Ardoz', 'Tres Cantos', 'Valdemoro', 'Villanueva de la Cañada', 'Villaviciosa de Odón'],
  'Málaga': ['Málaga', 'Marbella', 'Mijas', 'Vélez-Málaga', 'Fuengirola', 'Torremolinos', 'Benalmádena', 'Estepona', 'Rincón de la Victoria', 'Antequera', 'Ronda', 'Alhaurín de la Torre', 'Alhaurín el Grande', 'Cártama', 'Coín', 'Nerja', 'Torrox', 'Manilva', 'Archidona', 'Campillos'],
  'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura', 'Alcantarilla', 'Yecla', 'Águilas', 'Cieza', 'Mazarrón', 'Caravaca de la Cruz', 'Torre-Pacheco', 'Totana', 'Alhama de Murcia', 'Jumilla', 'San Javier', 'Las Torres de Cotillas', 'San Pedro del Pinatar', 'Archena', 'Mula', 'Ceutí'],
  'Navarra': ['Pamplona', 'Tudela', 'Barañáin', 'Valle de Egüés', 'Burlada', 'Estella-Lizarra', 'Zizur Mayor', 'Tafalla', 'Ansoáin', 'Villava', 'Berriozar', 'Sangüesa', 'Baztan', 'Noáin', 'Alsasua'],
  'Ourense': ['Ourense', 'Verín', 'O Barco de Valdeorras', 'O Carballiño', 'Xinzo de Limia', 'Allariz', 'Celanova', 'Ribadavia', 'A Rúa', 'Maceda'],
  'Palencia': ['Palencia', 'Aguilar de Campoo', 'Venta de Baños', 'Guardo', 'Villamuriel de Cerrato', 'Dueñas', 'Paredes de Nava', 'Cervera de Pisuerga', 'Saldaña', 'Herrera de Pisuerga'],
  'Pontevedra': ['Vigo', 'Pontevedra', 'Vilagarcía de Arousa', 'Redondela', 'Cangas', 'Marín', 'Ponteareas', 'A Estrada', 'Lalín', 'O Porriño', 'Moaña', 'Cambados', 'Tui', 'Sanxenxo', 'Nigrán', 'Baiona', 'Bueu', 'Gondomar', 'Poio', 'O Grove'],
  'Salamanca': ['Salamanca', 'Santa Marta de Tormes', 'Béjar', 'Ciudad Rodrigo', 'Villamayor', 'Carbajosa de la Sagrada', 'Peñaranda de Bracamonte', 'Guijuelo', 'Villares de la Reina', 'Alba de Tormes'],
  'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife', 'San Cristóbal de La Laguna', 'Arona', 'Adeje', 'Granadilla de Abona', 'La Orotava', 'Los Realejos', 'Puerto de la Cruz', 'Icod de los Vinos', 'Candelaria', 'Tacoronte', 'Güímar', 'Santiago del Teide', 'Los Llanos de Aridane', 'El Paso'],
  'Segovia': ['Segovia', 'Cuéllar', 'El Espinar', 'San Ildefonso', 'Cantalejo', 'Palazuelos de Eresma', 'Carbonero el Mayor', 'Nava de la Asunción', 'Riaza', 'Sepúlveda'],
  'Sevilla': ['Sevilla', 'Dos Hermanas', 'Alcalá de Guadaíra', 'Utrera', 'Mairena del Aljarafe', 'Écija', 'Los Palacios y Villafranca', 'La Rinconada', 'Carmona', 'Coria del Río', 'Morón de la Frontera', 'Lebrija', 'San Juan de Aznalfarache', 'Tomares', 'Bormujos', 'Camas', 'Marchena', 'Osuna', 'Mairena del Alcor', 'Arahal'],
  'Soria': ['Soria', 'Almazán', 'El Burgo de Osma', 'Ólvega', 'San Leonardo de Yagüe', 'San Esteban de Gormaz', 'Ágreda', 'Covaleda', 'Duruelo de la Sierra', 'Vinuesa'],
  'Tarragona': ['Tarragona', 'Reus', 'Tortosa', 'El Vendrell', 'Cambrils', 'Salou', 'Valls', 'Vila-seca', 'Amposta', 'Calafell', 'Sant Carles de la Ràpita', 'Cunit', 'Torredembarra', 'Deltebre', 'Mont-roig del Camp'],
  'Teruel': ['Teruel', 'Alcañiz', 'Andorra', 'Calamocha', 'Monreal del Campo', 'Utrillas', 'Alcorisa', 'Calanda', 'Albarracín', 'Valderrobres'],
  'Toledo': ['Toledo', 'Talavera de la Reina', 'Illescas', 'Seseña', 'Torrijos', 'Quintanar de la Orden', 'Sonseca', 'Madridejos', 'Mora', 'Ocaña', 'Consuegra', 'Fuensalida', 'Yuncos', 'Bargas', 'Villacañas'],
  'Valencia': ['Valencia', 'Gandia', 'Torrent', 'Paterna', 'Sagunto', 'Alzira', 'Mislata', 'Ontinyent', 'Burjassot', 'Xirivella', 'Manises', 'Alaquàs', 'Aldaia', 'Sueca', 'Oliva', 'Catarroja', 'Quart de Poblet', 'Cullera', 'Paiporta', 'Xàtiva', 'Llíria', 'Alboraya', 'Requena', 'Picassent', 'L\'Alcúdia', 'Carlet', 'Algemesí', 'Utiel', 'Bétera', 'Chiva'],
  'Valladolid': ['Valladolid', 'Medina del Campo', 'Laguna de Duero', 'Arroyo de la Encomienda', 'Tordesillas', 'Tudela de Duero', 'Íscar', 'Simancas', 'Peñafiel', 'Olmedo'],
  'Vizcaya': ['Bilbao', 'Barakaldo', 'Getxo', 'Portugalete', 'Santurtzi', 'Basauri', 'Leioa', 'Galdakao', 'Durango', 'Erandio', 'Sestao', 'Amorebieta-Etxano', 'Mungia', 'Bermeo', 'Gernika-Lumo'],
  'Zamora': ['Zamora', 'Benavente', 'Toro', 'Morales del Vino', 'Villaralbo', 'Fuentesaúco', 'Puebla de Sanabria', 'Moraleja del Vino', 'Fermoselle', 'Villalpando'],
  'Zaragoza': ['Zaragoza', 'Calatayud', 'Utebo', 'Ejea de los Caballeros', 'Tarazona', 'Caspe', 'La Almunia de Doña Godina', 'Zuera', 'Alagón', 'Tauste', 'Daroca', 'Borja', 'Épila', 'Cuarte de Huerva', 'María de Huerva']
};

// Función de ayuda para obtener ciudades según la provincia
export const getCitiesByProvince = (province) => {
  return cities[province] || [];
}; 