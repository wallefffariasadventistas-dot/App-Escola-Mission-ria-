/* ---- Meta geral da Missão Piauiense (definida pela Administração) ---- */
var missaoMetaAnual = { missionarios:0, estudos:0, batismos:0, enviados:0 };
var missaoMetasTrimestrais = [
  { missionarios:0, estudos:0, batismos:0, enviados:0 },
  { missionarios:0, estudos:0, batismos:0, enviados:0 },
  { missionarios:0, estudos:0, batismos:0, enviados:0 },
  { missionarios:0, estudos:0, batismos:0, enviados:0 }
];
function aggregateAchievedTrimester(churches, i){
  var out = { missionarios:0, estudos:0, batismos:0, enviados:0 };
  churches.forEach(function(g){
    var t = g.trimestres && g.trimestres[i];
    if(t && t.alcancado){
      out.missionarios += t.valores.missionarios;
      out.estudos += t.valores.estudos;
      out.batismos += t.valores.batismos;
      out.enviados += t.valores.enviados;
    }
  });
  return out;
}
function somaIndicadores(obj){ return obj.missionarios+obj.estudos+obj.batismos+obj.enviados; }
function makeEmptyDesafiosProgress(){
  return { sabado13:0, treinamento:0, professores:0, planoMissionario:0, sabadoTarde:0, bonus:0 };
}
function makeEmptyDesafiosTrimestres(){
  return [makeEmptyDesafiosProgress(), makeEmptyDesafiosProgress(), makeEmptyDesafiosProgress(), makeEmptyDesafiosProgress()];
}
function makeChurch(nome, distrito, membros, tipo){
  return {
    nome:nome, distrito:distrito, membros:membros, tipo:tipo||'Igreja',
    metas: computeDefaultMetas(membros),
    valores: { missionarios:0, estudos:0, batismos:0, colp:0, plant:0, sva:0, oyim:0 },
    trimestres: makeEmptyTrimestres(),
    desafiosTrimestres: makeEmptyDesafiosTrimestres()
  };
}
var igrejasList = [
  // Aeroporto - PI
  makeChurch('Aeroporto - Teresina','Aeroporto - PI',172),
  makeChurch('Esperança','Aeroporto - PI',153),
  makeChurch('Mafrense','Aeroporto - PI',146),
  makeChurch('Nova Brasília - Aeroporto','Aeroporto - PI',55),
  makeChurch('Parque Alvorada','Aeroporto - PI',85),
  makeChurch('São Joaquim - Aeroporto','Aeroporto - PI',49),
  // Agricolândia
  makeChurch('Água Branca - PI','Agricolândia',97),
  makeChurch('Alto do Balanço','Agricolândia',66),
  makeChurch('Bela Vista - Regeneração','Agricolândia',145),
  makeChurch('Central de Agricolândia','Agricolândia',152),
  makeChurch('Ferreira Nunes','Agricolândia',90),
  makeChurch('Jaicó','Agricolândia',102),
  makeChurch('Lagoinha','Agricolândia',66),
  makeChurch('Regeneração','Agricolândia',46),
  // Além Rio
  makeChurch('Conviver','Além Rio',64),
  makeChurch('Jacinta Andrade','Além Rio',81),
  makeChurch('Leonel Brizola','Além Rio',237),
  makeChurch('Mocambinho I','Além Rio',94),
  makeChurch('Mocambinho II','Além Rio',48),
  makeChurch('Parque Brasil 3','Além Rio',91),
  makeChurch('Parque Wall Ferraz','Além Rio',205),
  makeChurch('Santa Sofia','Além Rio',77),
  // Boa Esperança - Parnaíba
  makeChurch('Bairro Ceará','Boa Esperança - Parnaíba',65),
  makeChurch('Boa Esperança','Boa Esperança - Parnaíba',139),
  makeChurch('Joaz Sousa','Boa Esperança - Parnaíba',63),
  makeChurch('Tabuleiro - Boa Esperança','Boa Esperança - Parnaíba',80),
  // Bom Jesus
  makeChurch('Avelino Lopes','Bom Jesus',106),
  makeChurch('Bom Jesus','Bom Jesus',124),
  makeChurch('Corrente','Bom Jesus',89),
  makeChurch('Curimatá','Bom Jesus',88),
  // Campo Maior
  makeChurch('Barras','Campo Maior',86),
  makeChurch('Campo Maior','Campo Maior',128),
  makeChurch('São Miguel do Tapuio','Campo Maior',86),
  // Central Teresina
  makeChurch('Central Teresina','Central Teresina',406),
  makeChurch('Ininga','Central Teresina',90),
  makeChurch('Jóquei Clube','Central Teresina',129),
  // Dirceu Arco Verde
  makeChurch('Deus Quer','Dirceu Arco Verde',92),
  makeChurch('Dirceu Arco Verde II','Dirceu Arco Verde',261),
  makeChurch('Monte Horebe','Dirceu Arco Verde',97),
  makeChurch('Parque Jurema','Dirceu Arco Verde',114),
  makeChurch('Renascença','Dirceu Arco Verde',103),
  // Floriano
  makeChurch('Alto da Cruz','Floriano',192),
  makeChurch('Catumbi','Floriano',140),
  makeChurch('Central de Floriano','Floriano',105),
  makeChurch('Irapuá','Floriano',168),
  makeChurch('Nazaré do Piauí','Floriano',50),
  makeChurch('Oeiras','Floriano',83),
  // Guadalupe
  makeChurch('Baixa Grande do Ribeiro - Guadalupe','Guadalupe',265),
  makeChurch('Cruzeta','Guadalupe',74),
  makeChurch('Guadalupe','Guadalupe',156),
  makeChurch('Uruçuí','Guadalupe',154),
  // José de Freitas
  makeChurch('Barragem do Bezerro - José de Freitas','José de Freitas',94),
  makeChurch('Cidade Nova - José de Freitas','José de Freitas',68),
  makeChurch('Gaspar','José de Freitas',49),
  makeChurch('José de Freitas','José de Freitas',114),
  makeChurch('Miguel Alves','José de Freitas',99),
  makeChurch('Santa Luzia','José de Freitas',91),
  makeChurch('Suco de Uva','José de Freitas',74),
  // Luzilândia
  makeChurch('Dnocs - Luzilândia','Luzilândia',25),
  makeChurch('Esperantina','Luzilândia',78),
  makeChurch('Luzilândia I - Sede','Luzilândia',151),
  makeChurch('Luzilândia II - Centro','Luzilândia',81),
  makeChurch('Madeiro','Luzilândia',143),
  makeChurch('Mão Santa','Luzilândia',83),
  makeChurch('Matias Olímpio','Luzilândia',52),
  makeChurch('Novo Oriente II','Luzilândia',82),
  makeChurch('São João do Arraial','Luzilândia',66),
  // Monte Castelo
  makeChurch('Monte Castelo','Monte Castelo',138),
  makeChurch('São Pedro - Monte Castelo','Monte Castelo',205),
  makeChurch('Três Andares','Monte Castelo',130),
  makeChurch('Vila Costa Rica - Monte Castelo','Monte Castelo',101),
  // Parnaíba
  makeChurch('Alto Santa Maria','Parnaíba',56),
  makeChurch('Bairro João XXIII - Parnaíba','Parnaíba',134),
  makeChurch('Bairro Piauí','Parnaíba',163),
  makeChurch('Parnaíba','Parnaíba',302),
  makeChurch('Planalto','Parnaíba',88),
  // Parque Ideal
  makeChurch('Alto da Ressurreição','Parque Ideal',127),
  makeChurch('Altos','Parque Ideal',118),
  makeChurch('Dirceu I','Parque Ideal',88),
  makeChurch('Parque Ideal','Parque Ideal',215),
  // Parque Piauí
  makeChurch('Afonso Gil','Parque Piauí',58),
  makeChurch('Angelim','Parque Piauí',83),
  makeChurch('Cerâmica Cil','Parque Piauí',80),
  makeChurch('Lourival Parente','Parque Piauí',92),
  makeChurch('Nazária','Parque Piauí',119),
  makeChurch('Parque Piauí','Parque Piauí',120),
  makeChurch('Promorar II','Parque Piauí',96),
  makeChurch('Sacy','Parque Piauí',62),
  // Passagem das Pedras - Picos
  makeChurch('Passagem das Pedras','Passagem das Pedras - Picos',151),
  makeChurch('Valença do Piauí','Passagem das Pedras - Picos',117),
  // Picos
  makeChurch('Junco - Picos','Picos',209),
  makeChurch('Paulistana','Picos',63),
  makeChurch('Sussuapara - Picos','Picos',56),
  // Piripiri
  makeChurch('Areia Branca - PI','Piripiri',102),
  makeChurch('D. Pedro II','Piripiri',147),
  makeChurch('Piripiri','Piripiri',114),
  // Porto Alegre
  makeChurch('Cidade Nova - Demerval Lobão','Porto Alegre',72),
  makeChurch('Demerval Lobão','Porto Alegre',136),
  makeChurch('Portal da Alegria 4','Porto Alegre',151),
  makeChurch('Portal da Alegria I','Porto Alegre',56),
  makeChurch('Porto Alegre','Porto Alegre',90),
  makeChurch('Santa Clara','Porto Alegre',65),
  makeChurch('Vila Irmã Dulce','Porto Alegre',109),
  // Primavera
  makeChurch('Água Mineral','Primavera',104),
  makeChurch('Alto Alegre - Primavera','Primavera',55),
  makeChurch('Bairro São Francisco','Primavera',95),
  makeChurch('Bom Jesus - Primavera','Primavera',83),
  makeChurch('Buenos Aires','Primavera',119),
  makeChurch('Primavera - Sede','Primavera',138),
  makeChurch('Primavera I','Primavera',84),
  // Promorar
  makeChurch('Parque Sul','Promorar',76),
  makeChurch('Planalto Bela Vista','Promorar',137),
  makeChurch('Promorar','Promorar',179),
  makeChurch('Vila Felicidade','Promorar',70),
  // São Raimundo Nonato
  makeChurch('Paes Landim','São Raimundo Nonato',102),
  makeChurch('Santa Luzia - São Raimundo Nonato','São Raimundo Nonato',54),
  makeChurch('São João do Piauí','São Raimundo Nonato',56),
  makeChurch('São Raimundo Nonato','São Raimundo Nonato',101),
  // Teresina Leste
  makeChurch('Anita Ferraz','Teresina Leste',103),
  makeChurch('Cidade Leste','Teresina Leste',76),
  makeChurch('Piçarreira','Teresina Leste',79),
  makeChurch('Satélite','Teresina Leste',102),
  makeChurch('Socopo','Teresina Leste',233),
  makeChurch('Vale do Gavião','Teresina Leste',74),

  // ===== GRUPOS =====
  // Aeroporto - PI
  makeChurch('Boa Esperança - Aeroporto','Aeroporto - PI',36,'Grupo'),
  // Agricolândia
  makeChurch('Água Branca - Mutirão','Agricolândia',24,'Grupo'),
  makeChurch('Amarante do PI','Agricolândia',23,'Grupo'),
  makeChurch('Angical do Piauí','Agricolândia',40,'Grupo'),
  makeChurch('Curralinhos','Agricolândia',37,'Grupo'),
  makeChurch('Estaca Zero','Agricolândia',39,'Grupo'),
  makeChurch('Hugo Napoleão','Agricolândia',14,'Grupo'),
  makeChurch('Jardim do Mulato','Agricolândia',16,'Grupo'),
  makeChurch('Pitombeira','Agricolândia',16,'Grupo'),
  makeChurch('São Gonçalo','Agricolândia',35,'Grupo'),
  makeChurch('São Pedro do Piauí','Agricolândia',15,'Grupo'),
  makeChurch('São Vicente - Regeneração','Agricolândia',39,'Grupo'),
  makeChurch('Tabuleiro Grande','Agricolândia',23,'Grupo'),
  // Além Rio
  makeChurch('Francisca Trindade','Além Rio',91,'Grupo'),
  makeChurch('Mocambinho III','Além Rio',46,'Grupo'),
  makeChurch('Novo Mocambinho','Além Rio',51,'Grupo'),
  makeChurch('Padre Humberto','Além Rio',31,'Grupo'),
  makeChurch('Parque Brasil II','Além Rio',48,'Grupo'),
  makeChurch('Parque Firmino Filho','Além Rio',56,'Grupo'),
  makeChurch('Santa Maria da Codipi','Além Rio',91,'Grupo'),
  makeChurch('São Vicente de Baixo','Além Rio',0,'Grupo'),
  // Boa Esperança - Parnaíba
  makeChurch('Broderville','Boa Esperança - Parnaíba',40,'Grupo'),
  makeChurch('Buriti dos Lopes','Boa Esperança - Parnaíba',51,'Grupo'),
  makeChurch('Campestre','Boa Esperança - Parnaíba',31,'Grupo'),
  makeChurch('Cocal','Boa Esperança - Parnaíba',37,'Grupo'),
  makeChurch('Lagoa da Prata','Boa Esperança - Parnaíba',30,'Grupo'),
  makeChurch('Lagoa do Prado','Boa Esperança - Parnaíba',32,'Grupo'),
  makeChurch('São Vicente de Paula','Boa Esperança - Parnaíba',39,'Grupo'),
  // Bom Jesus
  makeChurch('Alvorada do Gurgeia','Bom Jesus',50,'Grupo'),
  makeChurch('Colônia do Gurgueia','Bom Jesus',15,'Grupo'),
  makeChurch('Cristino Castro','Bom Jesus',35,'Grupo'),
  makeChurch('Elizeu Martins','Bom Jesus',26,'Grupo'),
  makeChurch('Monte Alto','Bom Jesus',27,'Grupo'),
  makeChurch('Nova Curimatá','Bom Jesus',39,'Grupo'),
  makeChurch('Poço Vermelho','Bom Jesus',21,'Grupo'),
  makeChurch('Redenção do Gurgueia','Bom Jesus',40,'Grupo'),
  makeChurch('São Miguel','Bom Jesus',25,'Grupo'),
  makeChurch('Vila Branca','Bom Jesus',21,'Grupo'),
  // Campo Maior
  makeChurch('Bom Lugar - Campo Maior','Campo Maior',0,'Grupo'),
  makeChurch('Cachoeira','Campo Maior',44,'Grupo'),
  makeChurch('Canto Escuro','Campo Maior',56,'Grupo'),
  makeChurch('Castelo do Piauí','Campo Maior',49,'Grupo'),
  makeChurch('Cocal de Telha','Campo Maior',40,'Grupo'),
  makeChurch('Jardim II - Barras','Campo Maior',29,'Grupo'),
  makeChurch('Murici Grande','Campo Maior',38,'Grupo'),
  makeChurch('Santa Cruz - C. Maior','Campo Maior',42,'Grupo'),
  makeChurch('Santa Lina - C. Maior','Campo Maior',52,'Grupo'),
  makeChurch('Santinho (Barras) - JF','Campo Maior',42,'Grupo'),
  makeChurch('São João - C. Maior','Campo Maior',38,'Grupo'),
  makeChurch('Sossego - JF','Campo Maior',73,'Grupo'),
  // Central Teresina
  makeChurch('Colégio Adventista - CAT','Central Teresina',13,'Grupo'),
  makeChurch('Novo Ilhotas','Central Teresina',37,'Grupo'),
  // Dirceu Arco Verde
  makeChurch('Novo Horizonte','Dirceu Arco Verde',43,'Grupo'),
  makeChurch('Parque Alexandria','Dirceu Arco Verde',56,'Grupo'),
  makeChurch('Residencial Firmino Filho III','Dirceu Arco Verde',16,'Grupo'),
  makeChurch('Taboca','Dirceu Arco Verde',61,'Grupo'),
  // Floriano
  makeChurch('Cajueiro II','Floriano',21,'Grupo'),
  makeChurch('Escondido','Floriano',27,'Grupo'),
  makeChurch('Itaueira','Floriano',59,'Grupo'),
  makeChurch('Manguinha','Floriano',43,'Grupo'),
  makeChurch('São José do Peixe - Floriano','Floriano',18,'Grupo'),
  makeChurch('Serrinha','Floriano',17,'Grupo'),
  // Guadalupe
  makeChurch('Bairro Areia','Guadalupe',43,'Grupo'),
  makeChurch('Jerumenha','Guadalupe',37,'Grupo'),
  makeChurch('Ribeiro Gonçalves - PI','Guadalupe',33,'Grupo'),
  // José de Freitas
  makeChurch('Árvores Verdes - JF','José de Freitas',23,'Grupo'),
  makeChurch('Barrocas','José de Freitas',47,'Grupo'),
  makeChurch('Bom Jesus - José de Freitas','José de Freitas',18,'Grupo'),
  makeChurch('Fim de Rastro','José de Freitas',71,'Grupo'),
  makeChurch('Lagoa Alegre','José de Freitas',43,'Grupo'),
  makeChurch('Nossa Senhora dos Remédios','José de Freitas',44,'Grupo'),
  makeChurch('Salobro - José de Freitas','José de Freitas',31,'Grupo'),
  makeChurch('Salva Terra','José de Freitas',50,'Grupo'),
  makeChurch('Serra do Coroatá','José de Freitas',21,'Grupo'),
  makeChurch('Tucuns Maratuã - José de Freitas','José de Freitas',43,'Grupo'),
  makeChurch('União','José de Freitas',63,'Grupo'),
  // Luzilândia
  makeChurch('Batalha','Luzilândia',51,'Grupo'),
  makeChurch('Cacimbas II','Luzilândia',33,'Grupo'),
  makeChurch('Chapada do Barrocão','Luzilândia',36,'Grupo'),
  makeChurch('Coroa','Luzilândia',32,'Grupo'),
  makeChurch('Gameleira','Luzilândia',30,'Grupo'),
  makeChurch('Joaquim Pires','Luzilândia',11,'Grupo'),
  makeChurch('Joca Marques','Luzilândia',11,'Grupo'),
  makeChurch('Lagoa do Tabuleiro','Luzilândia',17,'Grupo'),
  makeChurch('Murici','Luzilândia',19,'Grupo'),
  makeChurch('Novo Tempo','Luzilândia',81,'Grupo'),
  makeChurch('São José - Luzilândia','Luzilândia',62,'Grupo'),
  makeChurch('Sussuapara','Luzilândia',41,'Grupo'),
  // Monte Castelo
  makeChurch('Cidade Nova','Monte Castelo',70,'Grupo'),
  makeChurch('Cristo Rei','Monte Castelo',10,'Grupo'),
  makeChurch('Parque Rodoviário','Monte Castelo',29,'Grupo'),
  makeChurch('Redenção','Monte Castelo',32,'Grupo'),
  // Parnaíba
  makeChurch('Bairro Campos - Parnaíba','Parnaíba',10,'Grupo'),
  makeChurch('Beira Mar - Luís Correia','Parnaíba',44,'Grupo'),
  makeChurch('Catanduvas','Parnaíba',13,'Grupo'),
  makeChurch('Frei Higino','Parnaíba',68,'Grupo'),
  makeChurch('Ilha Grande','Parnaíba',53,'Grupo'),
  makeChurch('Luís Correia','Parnaíba',54,'Grupo'),
  makeChurch('Macapá','Parnaíba',64,'Grupo'),
  makeChurch('Portinho','Parnaíba',49,'Grupo'),
  makeChurch('Sobradinho','Parnaíba',86,'Grupo'),
  // Parque Ideal
  makeChurch('Alegria','Parque Ideal',50,'Grupo'),
  makeChurch('Ciana','Parque Ideal',1,'Grupo'),
  makeChurch('Coivaras','Parque Ideal',14,'Grupo'),
  makeChurch('Ludgero Raulino - Altos','Parque Ideal',1,'Grupo'),
  makeChurch('Parque Progresso','Parque Ideal',63,'Grupo'),
  makeChurch('Povoado Retiro','Parque Ideal',27,'Grupo'),
  makeChurch('São João da Serra','Parque Ideal',35,'Grupo'),
  makeChurch('Vale da Esperança','Parque Ideal',49,'Grupo'),
  // Parque Piauí
  makeChurch('Campestre Sul','Parque Piauí',32,'Grupo'),
  makeChurch('Chapada do Gato - PQ','Parque Piauí',39,'Grupo'),
  makeChurch('Ministério Carcerário MPI','Parque Piauí',330,'Grupo'),
  makeChurch('Palmeirais','Parque Piauí',69,'Grupo'),
  makeChurch('Santa Fé','Parque Piauí',44,'Grupo'),
  makeChurch('Várzea','Parque Piauí',27,'Grupo'),
  // Passagem das Pedras - Picos
  makeChurch('Aroazes','Passagem das Pedras - Picos',19,'Grupo'),
  makeChurch('Bairro São José - Picos','Passagem das Pedras - Picos',33,'Grupo'),
  makeChurch('Inhuma','Passagem das Pedras - Picos',42,'Grupo'),
  makeChurch('Ipiranga do Piauí','Passagem das Pedras - Picos',48,'Grupo'),
  makeChurch('Novo Oriente','Passagem das Pedras - Picos',18,'Grupo'),
  makeChurch('Santa Cruz - Picos','Passagem das Pedras - Picos',17,'Grupo'),
  makeChurch('Sossego - Passagem das Pedras','Passagem das Pedras - Picos',74,'Grupo'),
  // Picos
  makeChurch('Alagoinha','Picos',32,'Grupo'),
  makeChurch('Fronteiras','Picos',18,'Grupo'),
  makeChurch('Gameleira - Picos','Picos',21,'Grupo'),
  makeChurch('Itainópolis','Picos',19,'Grupo'),
  makeChurch('Jaicós','Picos',34,'Grupo'),
  makeChurch('Mandacarú','Picos',41,'Grupo'),
  makeChurch('Monsenhor Hipólito','Picos',52,'Grupo'),
  makeChurch('Paraibinha','Picos',37,'Grupo'),
  makeChurch('Pio IX - Picos','Picos',33,'Grupo'),
  makeChurch('Riachão','Picos',40,'Grupo'),
  // Piripiri
  makeChurch('Capitão de Campos','Piripiri',61,'Grupo'),
  makeChurch('Jardim - Boa Hora','Piripiri',16,'Grupo'),
  makeChurch('Milton Brandão','Piripiri',19,'Grupo'),
  makeChurch('Pequis','Piripiri',30,'Grupo'),
  makeChurch('Piracuruca','Piripiri',72,'Grupo'),
  makeChurch('Prado - C. Maior','Piripiri',34,'Grupo'),
  makeChurch('Santa Fé - Piripiri','Piripiri',20,'Grupo'),
  makeChurch('São João - Piripiri','Piripiri',64,'Grupo'),
  // Porto Alegre
  makeChurch('17 de Abril','Porto Alegre',44,'Grupo'),
  makeChurch('Eduardo Costa','Porto Alegre',19,'Grupo'),
  makeChurch('Humaitá - Promorar','Porto Alegre',19,'Grupo'),
  makeChurch('Lagoa do Piauí','Porto Alegre',30,'Grupo'),
  makeChurch('Loteamento São Francisco','Porto Alegre',43,'Grupo'),
  makeChurch('Mário Covas','Porto Alegre',72,'Grupo'),
  makeChurch('Morro dos Cegos','Porto Alegre',68,'Grupo'),
  makeChurch('Parque Torquato Neto','Porto Alegre',65,'Grupo'),
  makeChurch('Parque Vitória','Porto Alegre',54,'Grupo'),
  makeChurch('São Pedro - Demerval Lobão','Porto Alegre',42,'Grupo'),
  makeChurch('Teresina Bosque Sul','Porto Alegre',82,'Grupo'),
  // Primavera
  makeChurch('Real Copagre','Primavera',99,'Grupo'),
  makeChurch('Risoleta Neves','Primavera',27,'Grupo'),
  // Promorar
  makeChurch('Bela Vista III','Promorar',72,'Grupo'),
  makeChurch('Betinho','Promorar',61,'Grupo'),
  makeChurch('Dagmarmazza','Promorar',29,'Grupo'),
  makeChurch('Novo Promorar','Promorar',57,'Grupo'),
  makeChurch('Vila Mariana','Promorar',54,'Grupo'),
  makeChurch('Vila Tiradentes','Promorar',55,'Grupo'),
  // São Raimundo Nonato
  makeChurch('Alto Santa Fé','São Raimundo Nonato',20,'Grupo'),
  makeChurch('Bela Vista - São Raimundo','São Raimundo Nonato',36,'Grupo'),
  makeChurch('Campo Alegre do Fidalgo','São Raimundo Nonato',31,'Grupo'),
  makeChurch('Canto do Buriti','São Raimundo Nonato',18,'Grupo'),
  makeChurch('Caracol','São Raimundo Nonato',0,'Grupo'),
  makeChurch('Pedro Laurentino','São Raimundo Nonato',10,'Grupo'),
  makeChurch('Simplício Mendes','São Raimundo Nonato',32,'Grupo'),
  makeChurch('Vila João Vaqueiro','São Raimundo Nonato',15,'Grupo'),
  makeChurch('Vistosa','São Raimundo Nonato',28,'Grupo'),
  // Teresina Leste
  makeChurch('Cidade Jardim','Teresina Leste',24,'Grupo'),
  makeChurch('Fazenda Soares','Teresina Leste',14,'Grupo'),
  makeChurch('Gurupá','Teresina Leste',36,'Grupo'),
  makeChurch('Nova Teresina','Teresina Leste',44,'Grupo'),
  makeChurch('Parque Universitário','Teresina Leste',20,'Grupo'),
  makeChurch('Planalto Uruguai','Teresina Leste',21,'Grupo'),
  makeChurch('Residencial Árvores Verdes','Teresina Leste',60,'Grupo'),
  makeChurch('Vila do Avião - PI','Teresina Leste',65,'Grupo'),
  makeChurch('Vila Nova','Teresina Leste',40,'Grupo')
];
var desafiosDefs = [
  { key:'sabado13', nome:'Celebração do 13º Sábado', peso:2.5, meta:'Trimestral · peso 2,5%', icon:'🎉', bg:'var(--green-light)', color:'var(--green)' },
  { key:'treinamento', nome:'Treinamento Formativo', peso:5, meta:'Mensal · 1,6667% / mês (5% no trimestre)', icon:'📚', bg:'var(--amber-light)', color:'#8a6414' },
  { key:'professores', nome:'Classe de Professores', peso:5, meta:'Semanal · 0,4167% / semana (5% no trimestre)', icon:'🧑‍🏫', bg:'var(--primary-light)', color:'var(--primary)' },
  { key:'planoMissionario', nome:'Plano Missionário nas Unidades de Ação', peso:2.5, meta:'Semanal · 0,2083% / semana (2,5% no trimestre)', icon:'🚶', bg:'#F1EBFB', color:'var(--purple)' },
  { key:'sabadoTarde', nome:'Sábado Missionário à Tarde', peso:10, meta:'Semanal · 0,8333% / semana (10% no trimestre)', icon:'🕊️', bg:'var(--red-light)', color:'var(--red)' },
  { key:'bonus', nome:'Bônus · Reunião de Pastores e Líderes', peso:5, meta:'Mensal · 5% adicional (fora dos 25%)', icon:'⭐', bg:'var(--amber-light)', color:'#8a6414', bonus:true }
];
var desafiosScopeChurch = 'Aeroporto - Teresina';
function computeDistrictMetasFromChurches(distrito){
  var churches = igrejasList.filter(function(g){ return g.distrito===distrito; });
  var sum = { missionarios:0, estudos:0, batismos:0, enviados:0 };
  churches.forEach(function(g){
    sum.missionarios += g.metas.missionarios;
    sum.estudos += g.metas.estudos;
    sum.batismos += g.metas.batismos;
    sum.enviados += g.metas.enviados;
  });
  return {
    missionarios: Math.round(sum.missionarios*1.15),
    estudos: Math.round(sum.estudos*1.15),
    batismos: Math.round(sum.batismos*1.15),
    enviados: Math.round(sum.enviados*1.15)
  };
}
var distritosDefs = [
  { nome:'Aeroporto - PI', pastor:{ nome:'Emerson Paulo Da Silva', email:'emerson.paulo@missaopi.org.br', telefone:'' } },
  { nome:'Agricolândia', pastor:{ nome:'Gean da Silva Gonçalves', email:'gean.goncalves@missaopi.org.br', telefone:'' } },
  { nome:'Além Rio', pastor:{ nome:'Diomedio Rodrigues De Sousa Neto', email:'diomedio.sousa@missaopi.org.br', telefone:'' } },
  { nome:'Boa Esperança - Parnaíba', pastor:{ nome:'Jose Gomes da Silva', email:'jose.gomes@missaopi.org.br', telefone:'' } },
  { nome:'Bom Jesus', pastor:{ nome:'Paulo Henrique Anastacio Aderaldo', email:'paulo.aderaldo@missaopi.org.br', telefone:'' } },
  { nome:'Campo Maior', pastor:{ nome:'Otanio Caetano Damasceno', email:'otanio.damasceno@missaopi.org.br', telefone:'' } },
  { nome:'Central Teresina', pastor:{ nome:'Eduardo Matheus Ferreira Chateaubriand', email:'eduardo.chateaubriand@missaopi.org.br', telefone:'' } },
  { nome:'Dirceu Arco Verde', pastor:{ nome:'Tarcisio De Lima Pereira', email:'tarcisio.pereira@missaopi.org.br', telefone:'' } },
  { nome:'Floriano', pastor:{ nome:'Neurismar Bento Santos', email:'neurismar.santos@missaopi.org.br', telefone:'' } },
  { nome:'Guadalupe', pastor:{ nome:'Antonio Saulo De Araujo', email:'antonio.araujo@missaopi.org.br', telefone:'' } },
  { nome:'José de Freitas', pastor:{ nome:'Carlos André Ferreira De Oliveira', email:'carlos.oliveira@missaopi.org.br', telefone:'' } },
  { nome:'Luzilândia', pastor:{ nome:'Maciel Ribeiro Dos Santos', email:'maciel.santos@missaopi.org.br', telefone:'' } },
  { nome:'Monte Castelo', pastor:{ nome:'David Vieira Barros', email:'david.barros@missaopi.org.br', telefone:'' } },
  { nome:'Parnaíba', pastor:{ nome:'Mizael Almeida Cavalcanti', email:'mizael.cavalcanti@missaopi.org.br', telefone:'' } },
  { nome:'Parque Ideal', pastor:{ nome:'Pedro Saulo Jacinto Da Silva', email:'pedro.jacinto@missaopi.org.br', telefone:'' } },
  { nome:'Parque Piauí', pastor:{ nome:'Lucas Rodrigues Da Silva Rocha', email:'lucas.rocha@missaopi.org.br', telefone:'' } },
  { nome:'Passagem das Pedras - Picos', pastor:{ nome:'Carlos Wanderlan Arruda Do Nascimento', email:'carlos.nascimento@missaopi.org.br', telefone:'' } },
  { nome:'Picos', pastor:{ nome:'Alison Renally Moura Do Nascimento', email:'alison.nascimento@missaopi.org.br', telefone:'' } },
  { nome:'Piripiri', pastor:{ nome:'Matheus Yure Dos Santos', email:'matheus.santos@missaopi.org.br', telefone:'' } },
  { nome:'Porto Alegre', pastor:{ nome:'Kevin Elvis Rodriguez Lucano', email:'kevin.lucano@missaopi.org.br', telefone:'' } },
  { nome:'Primavera', pastor:{ nome:'Cid Gouveia', email:'cid.gouveia@missaopi.org.br', telefone:'' } },
  { nome:'Promorar', pastor:{ nome:'Marcos Delgado Da Silva', email:'marcos.delgado@missaopi.org.br', telefone:'' } },
  { nome:'São Raimundo Nonato', pastor:{ nome:'Raniele Gonçalves Costa', email:'raniele.costa@missaopi.org.br', telefone:'' } },
  { nome:'Teresina Leste', pastor:{ nome:'Mario Luiz Frere', email:'mario.frere@missaopi.org.br', telefone:'' } }
];
var distritosList = distritosDefs.map(function(d){
  return { nome:d.nome, pastor:d.pastor, metas: computeDistrictMetasFromChurches(d.nome) };
});
var pendingRequests = distritosList.map(function(d, i){
  return { id:i+1, nome:d.pastor.nome, perfil:'Pastor', destino:d.nome, email:d.pastor.email, telefone:d.pastor.telefone||'A definir', senha:'TrocarSenha123' };
});
var nextRequestId = pendingRequests.length+1;
var activeUsers = [];
var nextUserId = 1;
var editingUserId = null;
function renderDesafiosList(){
  var g = getChurch(desafiosScopeChurch);
  var wrap = document.getElementById('desafiosList');
  if(!g || !wrap) return;
  if(!g.desafiosTrimestres) g.desafiosTrimestres = makeEmptyDesafiosTrimestres();
  var progress = g.desafiosTrimestres[desafiosViewQuarter-1];
  var canEdit = (currentUserRole==='lider' && desafiosScopeChurch===userChurch) || currentUserRole==='adm';
  wrap.innerHTML = desafiosDefs.map(function(d){
    var pct = progress[d.key] || 0;
    var done = pct>=100;
    var statusClass = done ? 'status-done' : (pct>0 ? 'status-prog' : 'status-pend');
    var statusText = done ? 'Concluído' : (pct>0 ? 'Em andamento · '+pct+'%' : 'Pendente');
    var btnHtml = canEdit
      ? '<button class="mini-btn'+(done ? ' done' : '')+'" onclick="toggleChalDone(\''+d.key+'\')">'+(done ? '✓ Registrado' : 'Marcar realizado')+'</button>'
      : '';
    var extraStyle = d.bonus ? ' style="border-color:#F1DFA6; background:#FFFDF6;"' : '';
    var barExtra = d.bonus ? 'background:var(--amber);' : '';
    return '<div class="card chal"'+extraStyle+'>'
      + '<div class="ic" style="background:'+d.bg+'; color:'+d.color+';">'+d.icon+'</div>'
      + '<div class="body"><h4>'+d.nome+'</h4><div class="meta">'+d.meta+'</div>'
      + '<div class="bar"><div style="width:'+pct+'%;'+barExtra+'"></div></div>'
      + '<div class="chal-foot"><span class="status-pill '+statusClass+'">'+statusText+'</span>'+btnHtml+'</div>'
      + '</div></div>';
  }).join('');
}
var desafiosViewQuarter = 2;
function renderDesafiosQuarterTabs(){
  var wrap = document.getElementById('desafiosQuarterRow');
  if(!wrap) return;
  var labels = {1:'1º Trimestre',2:'2º Trimestre',3:'3º Trimestre',4:'4º Trimestre'};
  wrap.innerHTML = [1,2,3,4].map(function(q){
    var val = quarterlyScores[q] || 0;
    var cls = q===desafiosViewQuarter ? 'quarter-chip active' : 'quarter-chip';
    return '<div class="'+cls+'" onclick="selectDesafiosQuarter('+q+')"><b>'+val.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%</b><span>'+labels[q]+'</span></div>';
  }).join('');
}
function selectDesafiosQuarter(q){
  desafiosViewQuarter = q;
  renderDesafiosQuarterTabs();
  renderDesafiosList();
}
function toggleChalDone(key){
  var g = getChurch(desafiosScopeChurch);
  if(!g) return;
  var canEdit = (currentUserRole==='lider' && desafiosScopeChurch===userChurch) || currentUserRole==='adm';
  if(!canEdit) return;
  if(!g.desafiosTrimestres) g.desafiosTrimestres = makeEmptyDesafiosTrimestres();
  var progress = g.desafiosTrimestres[desafiosViewQuarter-1];
  if(!g.desafiosProgressOriginal) g.desafiosProgressOriginal = {};
  var origKey = desafiosViewQuarter+'_'+key;
  var current = progress[key] || 0;
  if(current>=100){
    progress[key] = g.desafiosProgressOriginal[origKey]!==undefined ? g.desafiosProgressOriginal[origKey] : 0;
    toast('Registro desfeito — desafio voltou a pendente no '+desafiosViewQuarter+'º trimestre.');
  } else {
    g.desafiosProgressOriginal[origKey] = current;
    progress[key] = 100;
    toast('Desafio marcado como realizado no '+desafiosViewQuarter+'º trimestre.');
  }
  renderDesafiosList();
  renderDesafiosQuarterTabs();
  if(typeof calculateQuarterScore==='function') calculateQuarterScore();
}
function selectDesafiosChurch(nome){
  desafiosScopeChurch = nome;
  var g = getChurch(nome);
  var note = document.getElementById('desafiosScopeNote');
  if(note) note.textContent = nome+(g ? ' · '+g.distrito : '');
  renderDesafiosList();
}
function applyDesafiosRoleRestrictions(){
  var picker = document.getElementById('desafiosChurchPicker');
  var select = document.getElementById('desafiosChurchSelect');
  if(!picker || !select) return;
  if(currentUserRole==='pastor'){
    var churches = churchesInDistrict(userDistrict);
    select.innerHTML = churches.map(function(g){ return '<option value="'+escapeHtml(g.nome)+'">'+escapeHtml(g.nome)+'</option>'; }).join('');
    if(!churches.some(function(g){ return g.nome===desafiosScopeChurch; })){
      desafiosScopeChurch = churches.length ? churches[0].nome : userChurch;
    }
    select.value = desafiosScopeChurch;
    picker.classList.remove('hidden');
  } else if(currentUserRole==='adm'){
    select.innerHTML = igrejasList.map(function(g){ return '<option value="'+escapeHtml(g.nome)+'">'+escapeHtml(g.nome)+'</option>'; }).join('');
    if(!getChurch(desafiosScopeChurch)) desafiosScopeChurch = igrejasList[0].nome;
    select.value = desafiosScopeChurch;
    picker.classList.remove('hidden');
  } else {
    desafiosScopeChurch = userChurch;
    picker.classList.add('hidden');
  }
  var g = getChurch(desafiosScopeChurch);
  var note = document.getElementById('desafiosScopeNote');
  if(note) note.textContent = desafiosScopeChurch+(g ? ' · '+g.distrito : '');
  renderDesafiosQuarterTabs();
  renderDesafiosList();
}
function applyAdminMenuRoleRestrictions(){
  var isPastor = currentUserRole==='pastor';
  var banner = document.getElementById('adminBanner');
  if(banner){
    banner.textContent = isPastor
      ? 'Acesso de Distrito — Pastor · '+userDistrict
      : 'Acesso total — Administração da Missão Piauiense';
  }
  var materiaisItem = document.getElementById('adminMenuMateriais');
  var campanhasItem = document.getElementById('adminMenuCampanhas');
  var denunciasItem = document.getElementById('adminMenuDenuncias');
  if(materiaisItem) materiaisItem.classList.toggle('hidden', isPastor);
  if(campanhasItem) campanhasItem.classList.toggle('hidden', isPastor);
  if(denunciasItem) denunciasItem.classList.toggle('hidden', isPastor);
  var denunciasSub = document.getElementById('adminMenuDenunciasSub');
  if(denunciasSub){
    var pendCount = reportedPosts.filter(function(r){ return r.status==='pendente'; }).length;
    denunciasSub.textContent = pendCount>0 ? pendCount+' pendente'+(pendCount===1?'':'s')+' de revisão' : 'Nenhuma denúncia pendente';
  }

  var usuariosSub = document.getElementById('adminMenuUsuariosSub');
  if(usuariosSub) usuariosSub.textContent = isPastor ? 'Aprovar Líderes do seu distrito' : 'Aprovar Pastores e Líderes';
  var igrejasSub = document.getElementById('adminMenuIgrejasSub');
  if(igrejasSub) igrejasSub.textContent = isPastor ? 'Igrejas do seu distrito' : 'Estrutura organizacional';
  var indicSub = document.getElementById('adminMenuIndicadoresSub');
  if(indicSub) indicSub.textContent = isPastor ? 'Metas anuais e trimestrais das igrejas do seu distrito' : 'Metas anuais e trimestrais por igreja';
  var rankSub = document.getElementById('adminMenuRankingsSub');
  if(rankSub) rankSub.textContent = isPastor ? 'Ranking do seu distrito' : 'Igrejas, distritos, líderes, pastores';
  var desafiosSub = document.getElementById('adminMenuDesafiosSub');
  if(desafiosSub) desafiosSub.textContent = isPastor ? 'Progresso das igrejas do seu distrito' : 'Pesos, períodos e catálogo';
}
var campanhasList = [
  { nome:'Semana Santa Missionária', status:'ativa' },
  { nome:'Campanha de Colportagem Jovem', status:'ativa' },
  { nome:'Mutirão de Batismo', status:'encerrada' }
];
var desafiosPesos = [
  { nome:'Celebração do 13º Sábado', meta:'Trimestral', peso:2.5 },
  { nome:'Treinamento Formativo', meta:'Mensal (÷3)', peso:5 },
  { nome:'Classe de Professores', meta:'Semanal (÷12)', peso:5 },
  { nome:'Plano Missionário nas Unidades de Ação', meta:'Semanal (÷12)', peso:2.5 },
  { nome:'Sábado Missionário à Tarde', meta:'Semanal (÷12)', peso:10 }
];

function openAdmin(section){
  document.getElementById('adminHome').classList.add('hidden');
  document.getElementById('adminDetail').classList.remove('hidden');
  renderAdmin(section);
  document.getElementById('content').scrollTop = 0;
}
function backAdmin(){
  document.getElementById('adminDetail').classList.add('hidden');
  document.getElementById('adminHome').classList.remove('hidden');
}
function renderAdmin(section){
  var body = document.getElementById('adminDetailBody');
  if(section==='usuarios') body.innerHTML = renderUsuarios();
  else if(section==='denuncias') body.innerHTML = renderReportsAdmin();
  else if(section==='igrejas') body.innerHTML = renderIgrejas();
  else if(section==='indicadores'){ body.innerHTML = renderIndicAdmin(); loadIndicAdminValues(); }
  else if(section==='materiais') body.innerHTML = renderMateriaisAdmin();
  else if(section==='rankings') body.innerHTML = renderRankingsAdmin();
  else if(section==='campanhas') body.innerHTML = renderCampanhas();
  else if(section==='desafios'){
    if(currentUserRole==='pastor'){ body.innerHTML = renderDesafiosAdminPastor(); }
    else { body.innerHTML = renderDesafiosAdmin(); refreshSumBanner(); }
  }
  body.dataset.section = section;
}

function initials(name){
  var parts = name.replace('Pr.','').trim().split(' ');
  return ((parts[0][0]||'') + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

