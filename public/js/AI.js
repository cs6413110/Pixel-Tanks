class AI {
  constructor(x, y, role, rank, team, host) {
    this.raw = {};
    ['role', 'rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'id', 'class', 'flashbanged', 'dedEffect'].forEach(p => {
      Object.defineProperty(this, p, {
        get: () => this.raw[p],
        set: v => this.setValue(p, v),
        configurable: true,
      });
    });
    const displayNames = ["Aaran", "Aaren", "Aarez", "Aarman", "Aaron", "Aaron-James", "Aarron", "Aaryan", "Aaryn", "Aayan", "Aazaan", "Abaan", "Abbas", "Abdallah", "Abdalroof", "Abdihakim", "Abdirahman", "Abdisalam", "Abdul", "Abdul-Aziz", "Abdulbasir", "Abdulkadir", "Abdulkarem", "Abdulkhader", "Abdullah", "Abdul-Majeed", "Abdulmalik", "Abdul-Rehman", "Abdur", "Abdurraheem", "Abdur-Rahman", "Abdur-Rehmaan", "Abel", "Abhinav", "Abhisumant", "Abid", "Abir", "Abraham", "Abu", "Abubakar", "Ace", "Adain", "Adam", "Adam-James", "Addison", "Addisson", "Adegbola", "Adegbolahan", "Aden", "Adenn", "Adie", "Adil", "Aditya", "Adnan", "Adrian", "Adrien", "Aedan", "Aedin", "Aedyn", "Aeron", "Afonso", "Ahmad", "Ahmed", "Ahmed-Aziz", "Ahoua", "Ahtasham", "Aiadan", "Aidan", "Aiden", "Aiden-Jack", "Aiden-Vee", "Aidian", "Aidy", "Ailin", "Aiman", "Ainsley", "Ainslie", "Airen", "Airidas", "Airlie", "AJ", "Ajay", "A-Jay", "Ajayraj", "Akan", "Akram", "Al", "Ala", "Alan", "Alanas", "Alasdair", "Alastair", "Alber", "Albert", "Albie", "Aldred", "Alec", "Aled", "Aleem", "Aleksandar", "Aleksander", "Aleksandr", "Aleksandrs", "Alekzander", "Alessandro", "Alessio", "Alex", "Alexander", "Alexei", "Alexx", "Alexzander", "Alf", "Alfee", "Alfie", "Alfred", "Alfy", "Alhaji", "Al-Hassan", "Ali", "Aliekber", "Alieu", "Alihaider", "Alisdair", "Alishan", "Alistair", "Alistar", "Alister", "Aliyaan", "Allan", "Allan-Laiton", "Allen", "Allesandro", "Allister", "Ally", "Alphonse", "Altyiab", "Alum", "Alvern", "Alvin", "Alyas", "Amaan", "Aman", "Amani", "Ambanimoh", "Ameer", "Amgad", "Ami", "Amin", "Amir", "Ammaar", "Ammar", "Ammer", "Amolpreet", "Amos", "Amrinder", "Amrit", "Amro", "Anay", "Andrea", "Andreas", "Andrei", "Andrejs", "Andrew", "Andy", "Anees", "Anesu", "Angel", "Angelo", "Angus", "Anir", "Anis", "Anish", "Anmolpreet", "Annan", "Anndra", "Anselm", "Anthony", "Anthony-John", "Antoine", "Anton", "Antoni", "Antonio", "Antony", "Antonyo", "Anubhav", "Aodhan", "Aon", "Aonghus", "Apisai", "Arafat", "Aran", "Arandeep", "Arann", "Aray", "Arayan", "Archibald", "Archie", "Arda", "Ardal", "Ardeshir", "Areeb", "Areez", "Aref", "Arfin", "Argyle", "Argyll", "Ari", "Aria", "Arian", "Arihant", "Aristomenis", "Aristotelis", "Arjuna", "Arlo", "Armaan", "Arman", "Armen", "Arnab", "Arnav", "Arnold", "Aron", "Aronas", "Arran", "Arrham", "Arron", "Arryn", "Arsalan", "Artem", "Arthur", "Artur", "Arturo", "Arun", "Arunas", "Arved", "Arya", "Aryan", "Aryankhan", "Aryian", "Aryn", "Asa", "Asfhan", "Ash", "Ashlee-jay", "Ashley", "Ashton", "Ashton-Lloyd", "Ashtyn", "Ashwin", "Asif", "Asim", "Aslam", "Asrar", "Ata", "Atal", "Atapattu", "Ateeq", "Athol", "Athon", "Athos-Carlos", "Atli", "Atom", "Attila", "Aulay", "Aun", "Austen", "Austin", "Avani", "Averon", "Avi", "Avinash", "Avraham", "Awais", "Awwal", "Axel", "Ayaan", "Ayan", "Aydan", "Ayden", "Aydin", "Aydon", "Ayman", "Ayomide", "Ayren", "Ayrton", "Aytug", "Ayub", "Ayyub", "Azaan", "Azedine", "Azeem", "Azim", "Aziz", "Azlan", "Azzam", "Azzedine", "Babatunmise", "Babur", "Bader", "Badr", "Badsha", "Bailee", "Bailey", "Bailie", "Bailley", "Baillie", "Baley", "Balian", "Banan", "Barath", "Barkley", "Barney", "Baron", "Barrie", "Barry", "Bartlomiej", "Bartosz", "Basher", "Basile", "Baxter", "Baye", "Bayley", "Beau", "Beinn", "Bekim", "Believe", "Ben", "Bendeguz", "Benedict", "Benjamin", "Benjamyn", "Benji", "Benn", "Bennett", "Benny", "Benoit", "Bentley", "Berkay", "Bernard", "Bertie", "Bevin", "Bezalel", "Bhaaldeen", "Bharath", "Bilal", "Bill", "Billy", "Binod", "Bjorn", "Blaike", "Blaine", "Blair", "Blaire", "Blake", "Blazej", "Blazey", "Blessing", "Blue", "Blyth", "Bo", "Boab", "Bob", "Bobby", "Bobby-Lee", "Bodhan", "Boedyn", "Bogdan", "Bohbi", "Bony", "Bowen", "Bowie", "Boyd", "Bracken", "Brad", "Bradan", "Braden", "Bradley", "Bradlie", "Bradly", "Brady", "Bradyn", "Braeden", "Braiden", "Brajan", "Brandan", "Branden", "Brandon", "Brandonlee", "Brandon-Lee", "Brandyn", "Brannan", "Brayden", "Braydon", "Braydyn", "Breandan", "Brehme", "Brendan", "Brendon", "Brendyn", "Breogan", "Bret", "Brett", "Briaddon", "Brian", "Brodi", "Brodie", "Brody", "Brogan", "Broghan", "Brooke", "Brooklin", "Brooklyn", "Bruce", "Bruin", "Bruno", "Brunon", "Bryan", "Bryce", "Bryden", "Brydon", "Brydon-Craig", "Bryn", "Brynmor", "Bryson", "Buddy", "Bully", "Burak", "Burhan", "Butali", "Butchi", "Byron", "Cabhan", "Cadan", "Cade", "Caden", "Cadon", "Cadyn", "Caedan", "Caedyn", "Cael", "Caelan", "Caelen", "Caethan", "Cahl", "Cahlum", "Cai", "Caidan", "Caiden", "Caiden-Paul", "Caidyn", "Caie", "Cailaen", "Cailean", "Caileb-John", "Cailin", "Cain", "Caine", "Cairn", "Cal", "Calan", "Calder", "Cale", "Calean", "Caleb", "Calen", "Caley", "Calib", "Calin", "Callahan", "Callan", "Callan-Adam", "Calley", "Callie", "Callin", "Callum", "Callun", "Callyn", "Calum", "Calum-James", "Calvin", "Cambell", "Camerin", "Cameron", "Campbel", "Campbell", "Camron", "Caolain", "Caolan", "Carl", "Carlo", "Carlos", "Carrich", "Carrick", "Carson", "Carter", "Carwyn", "Casey", "Casper", "Cassy", "Cathal", "Cator", "Cavan", "Cayden", "Cayden-Robert", "Cayden-Tiamo", "Ceejay", "Ceilan", "Ceiran", "Ceirin", "Ceiron", "Cejay", "Celik", "Cephas", "Cesar", "Cesare", "Chad", "Chaitanya", "Chang-Ha", "Charles", "Charley", "Charlie", "Charly", "Chase", "Che", "Chester", "Chevy", "Chi", "Chibudom", "Chidera", "Chimsom", "Chin", "Chintu", "Chiqal", "Chiron", "Chris", "Chris-Daniel", "Chrismedi", "Christian", "Christie", "Christoph", "Christopher", "Christopher-Lee", "Christy", "Chu", "Chukwuemeka", "Cian", "Ciann", "Ciar", "Ciaran", "Ciarian", "Cieran", "Cillian", "Cillin", "Cinar", "CJ", "C-Jay", "Clark", "Clarke", "Clayton", "Clement", "Clifford", "Clyde", "Cobain", "Coban", "Coben", "Cobi", "Cobie", "Coby", "Codey", "Codi", "Codie", "Cody", "Cody-Lee", "Coel", "Cohan", "Cohen", "Colby", "Cole", "Colin", "Coll", "Colm", "Colt", "Colton", "Colum", "Colvin", "Comghan", "Conal", "Conall", "Conan", "Conar", "Conghaile", "Conlan", "Conley", "Conli", "Conlin", "Conlly", "Conlon", "Conlyn", "Connal", "Connall", "Connan", "Connar", "Connel", "Connell", "Conner", "Connolly", "Connor", "Connor-David", "Conor", "Conrad", "Cooper", "Copeland", "Coray", "Corben", "Corbin", "Corey", "Corey-James", "Corey-Jay", "Cori", "Corie", "Corin", "Cormac", "Cormack", "Cormak", "Corran", "Corrie", "Cory", "Cosmo", "Coupar", "Craig", "Craig-James", "Crawford", "Creag", "Crispin", "Cristian", "Crombie", "Cruiz", "Cruz", "Cuillin", "Cullen", "Cullin", "Curtis", "Cyrus", "Daanyaal", "Daegan", "Daegyu", "Dafydd", "Dagon", "Dailey", "Daimhin", "Daithi", "Dakota", "Daksh", "Dale", "Dalong", "Dalton", "Damian", "Damien", "Damon", "Dan", "Danar", "Dane", "Danial", "Daniel", "Daniele", "Daniel-James", "Daniels", "Daniil", "Danish", "Daniyal", "Danniel", "Danny", "Dante", "Danyal", "Danyil", "Danys", "Daood", "Dara", "Darach", "Daragh", "Darcy", "D'arcy", "Dareh", "Daren", "Darien", "Darius", "Darl", "Darn", "Darrach", "Darragh", "Darrel", "Darrell", "Darren", "Darrie", "Darrius", "Darroch", "Darryl", "Darryn", "Darwyn", "Daryl", "Daryn", "Daud", "Daumantas", "Davi", "David", "David-Jay", "David-Lee", "Davie", "Davis", "Davy", "Dawid", "Dawson", "Dawud", "Dayem", "Daymian", "Deacon", "Deagan", "Dean", "Deano", "Decklan", "Declain", "Declan", "Declyan", "Declyn", "Dedeniseoluwa", "Deecan", "Deegan", "Deelan", "Deklain-Jaimes", "Del", "Demetrius", "Denis", "Deniss", "Dennan", "Dennin", "Dennis", "Denny", "Dennys", "Denon", "Denton", "Denver", "Denzel", "Deon", "Derek", "Derick", "Derin", "Dermot", "Derren", "Derrie", "Derrin", "Derron", "Derry", "Derryn", "Deryn", "Deshawn", "Desmond", "Dev", "Devan", "Devin", "Devlin", "Devlyn", "Devon", "Devrin", "Devyn", "Dex", "Dexter", "Dhani", "Dharam", "Dhavid", "Dhyia", "Diarmaid", "Diarmid", "Diarmuid", "Didier", "Diego", "Diesel", "Diesil", "Digby", "Dilan", "Dilano", "Dillan", "Dillon", "Dilraj", "Dimitri", "Dinaras", "Dion", "Dissanayake", "Dmitri", "Doire", "Dolan", "Domanic", "Domenico", "Domhnall", "Dominic", "Dominick", "Dominik", "Donald", "Donnacha", "Donnie", "Dorian", "Dougal", "Douglas", "Dougray", "Drakeo", "Dre", "Dregan", "Drew", "Dugald", "Duncan", "Duriel", "Dustin", "Dylan", "Dylan-Jack", "Dylan-James", "Dylan-John", "Dylan-Patrick", "Dylin", "Dyllan", "Dyllan-James", "Dyllon", "Eadie", "Eagann", "Eamon", "Eamonn", "Eason", "Eassan", "Easton", "Ebow", "Ed", "Eddie", "Eden", "Ediomi", "Edison", "Eduardo", "Eduards", "Edward", "Edwin", "Edwyn", "Eesa", "Efan", "Efe", "Ege", "Ehsan", "Ehsen", "Eiddon", "Eidhan", "Eihli", "Eimantas", "Eisa", "Eli", "Elias", "Elijah", "Eliot", "Elisau", "Eljay", "Eljon", "Elliot", "Elliott", "Ellis", "Ellisandro", "Elshan", "Elvin", "Elyan", "Emanuel", "Emerson", "Emil", "Emile", "Emir", "Emlyn", "Emmanuel", "Emmet", "Eng", "Eniola", "Enis", "Ennis", "Enrico", "Enrique", "Enzo", "Eoghain", "Eoghan", "Eoin", "Eonan", "Erdehan", "Eren", "Erencem", "Eric", "Ericlee", "Erik", "Eriz", "Ernie-Jacks", "Eroni", "Eryk", "Eshan", "Essa", "Esteban", "Ethan", "Etienne", "Etinosa", "Euan", "Eugene", "Evan", "Evann", "Ewan", "Ewen", "Ewing", "Exodi", "Ezekiel", "Ezra", "Fabian", "Fahad", "Faheem", "Faisal", "Faizaan", "Famara", "Fares", "Farhaan", "Farhan", "Farren", "Farzad", "Fauzaan", "Favour", "Fawaz", "Fawkes", "Faysal", "Fearghus", "Feden", "Felix", "Fergal", "Fergie", "Fergus", "Ferre", "Fezaan", "Fiachra", "Fikret", "Filip", "Filippo", "Finan", "Findlay", "Findlay-James", "Findlie", "Finlay", "Finley", "Finn", "Finnan", "Finnean", "Finnen", "Finnlay", "Finnley", "Fintan", "Fionn", "Firaaz", "Fletcher", "Flint", "Florin", "Flyn", "Flynn", "Fodeba", "Folarinwa", "Forbes", "Forgan", "Forrest", "Fox", "Francesco", "Francis", "Francisco", "Franciszek", "Franco", "Frank", "Frankie", "Franklin", "Franko", "Fraser", "Frazer", "Fred", "Freddie", "Frederick", "Fruin", "Fyfe", "Fyn", "Fynlay", "Fynn", "Gabriel", "Gallagher", "Gareth", "Garren", "Garrett", "Garry", "Gary", "Gavin", "Gavin-Lee", "Gene", "Geoff", "Geoffrey", "Geomer", "Geordan", "Geordie", "George", "Georgia", "Georgy", "Gerard", "Ghyll", "Giacomo", "Gian", "Giancarlo", "Gianluca", "Gianmarco", "Gideon", "Gil", "Gio", "Girijan", "Girius", "Gjan", "Glascott", "Glen", "Glenn", "Gordon", "Grady", "Graeme", "Graham", "Grahame", "Grant", "Grayson", "Greg", "Gregor", "Gregory", "Greig", "Griffin", "Griffyn", "Grzegorz", "Guang", "Guerin", "Guillaume", "Gurardass", "Gurdeep", "Gursees", "Gurthar", "Gurveer", "Gurwinder", "Gus", "Gustav", "Guthrie", "Guy", "Gytis", "Habeeb", "Hadji", "Hadyn", "Hagun", "Haiden", "Haider", "Hamad", "Hamid", "Hamish", "Hamza", "Hamzah", "Han", "Hansen", "Hao", "Hareem", "Hari", "Harikrishna", "Haris", "Harish", "Harjeevan", "Harjyot", "Harlee", "Harleigh", "Harley", "Harman", "Harnek", "Harold", "Haroon", "Harper", "Harri", "Harrington", "Harris", "Harrison", "Harry", "Harvey", "Harvie", "Harvinder", "Hasan", "Haseeb", "Hashem", "Hashim", "Hassan", "Hassanali", "Hately", "Havila", "Hayden", "Haydn", "Haydon", "Haydyn", "Hcen", "Hector", "Heddle", "Heidar", "Heini", "Hendri", "Henri", "Henry", "Herbert", "Heyden", "Hiro", "Hirvaansh", "Hishaam", "Hogan", "Honey", "Hong", "Hope", "Hopkin", "Hosea", "Howard", "Howie", "Hristomir", "Hubert", "Hugh", "Hugo", "Humza", "Hunter", "Husnain", "Hussain", "Hussan", "Hussnain", "Hussnan", "Hyden", "I", "Iagan", "Iain", "Ian", "Ibraheem", "Ibrahim", "Idahosa", "Idrees", "Idris", "Iestyn", "Ieuan", "Igor", "Ihtisham", "Ijay", "Ikechukwu", "Ikemsinachukwu", "Ilyaas", "Ilyas", "Iman", "Immanuel", "Inan", "Indy", "Ines", "Innes", "Ioannis", "Ireayomide", "Ireoluwa", "Irvin", "Irvine", "Isa", "Isaa", "Isaac", "Isaiah", "Isak", "Isher", "Ishwar", "Isimeli", "Isira", "Ismaeel", "Ismail", "Israel", "Issiaka", "Ivan", "Ivar", "Izaak", "J", "Jaay", "Jac", "Jace", "Jack", "Jacki", "Jackie", "Jack-James", "Jackson", "Jacky", "Jacob", "Jacques", "Jad", "Jaden", "Jadon", "Jadyn", "Jae", "Jagat", "Jago", "Jaheim", "Jahid", "Jahy", "Jai", "Jaida", "Jaiden", "Jaidyn", "Jaii", "Jaime", "Jai-Rajaram", "Jaise", "Jak", "Jake", "Jakey", "Jakob", "Jaksyn", "Jakub", "Jamaal", "Jamal", "Jameel", "Jameil", "James", "James-Paul", "Jamey", "Jamie", "Jan", "Jaosha", "Jardine", "Jared", "Jarell", "Jarl", "Jarno", "Jarred", "Jarvi", "Jasey-Jay", "Jasim", "Jaskaran", "Jason", "Jasper", "Jaxon", "Jaxson", "Jay", "Jaydan", "Jayden", "Jayden-James", "Jayden-Lee", "Jayden-Paul", "Jayden-Thomas", "Jaydn", "Jaydon", "Jaydyn", "Jayhan", "Jay-Jay", "Jayke", "Jaymie", "Jayse", "Jayson", "Jaz", "Jazeb", "Jazib", "Jazz", "Jean", "Jean-Lewis", "Jean-Pierre", "Jebadiah", "Jed", "Jedd", "Jedidiah", "Jeemie", "Jeevan", "Jeffrey", "Jensen", "Jenson", "Jensyn", "Jeremy", "Jerome", "Jeronimo", "Jerrick", "Jerry", "Jesse", "Jesuseun", "Jeswin", "Jevan", "Jeyun", "Jez", "Jia", "Jian", "Jiao", "Jimmy", "Jincheng", "JJ", "Joaquin", "Joash", "Jock", "Jody", "Joe", "Joeddy", "Joel", "Joey", "Joey-Jack", "Johann", "Johannes", "Johansson", "John", "Johnathan", "Johndean", "Johnjay", "John-Michael", "Johnnie", "Johnny", "Johnpaul", "John-Paul", "John-Scott", "Johnson", "Jole", "Jomuel", "Jon", "Jonah", "Jonatan", "Jonathan", "Jonathon", "Jonny", "Jonothan", "Jon-Paul", "Jonson", "Joojo", "Jordan", "Jordi", "Jordon", "Jordy", "Jordyn", "Jorge", "Joris", "Jorryn", "Josan", "Josef", "Joseph", "Josese", "Josh", "Joshiah", "Joshua", "Josiah", "Joss", "Jostelle", "Joynul", "Juan", "Jubin", "Judah", "Jude", "Jules", "Julian", "Julien", "Jun", "Junior", "Jura", "Justan", "Justin", "Justinas", "Kaan", "Kabeer", "Kabir", "Kacey", "Kacper", "Kade", "Kaden", "Kadin", "Kadyn", "Kaeden", "Kael", "Kaelan", "Kaelin", "Kaelum", "Kai", "Kaid", "Kaidan", "Kaiden", "Kaidinn", "Kaidyn", "Kaileb", "Kailin", "Kain", "Kaine", "Kainin", "Kainui", "Kairn", "Kaison", "Kaiwen", "Kajally", "Kajetan", "Kalani", "Kale", "Kaleb", "Kaleem", "Kal-el", "Kalen", "Kalin", "Kallan", "Kallin", "Kalum", "Kalvin", "Kalvyn", "Kameron", "Kames", "Kamil", "Kamran", "Kamron", "Kane", "Karam", "Karamvir", "Karandeep", "Kareem", "Karim", "Karimas", "Karl", "Karol", "Karson", "Karsyn", "Karthikeya", "Kasey", "Kash", "Kashif", "Kasim", "Kasper", "Kasra", "Kavin", "Kayam", "Kaydan", "Kayden", "Kaydin", "Kaydn", "Kaydyn", "Kaydyne", "Kayleb", "Kaylem", "Kaylum", "Kayne", "Kaywan", "Kealan", "Kealon", "Kean", "Keane", "Kearney", "Keatin", "Keaton", "Keavan", "Keayn", "Kedrick", "Keegan", "Keelan", "Keelin", "Keeman", "Keenan", "Keenan-Lee", "Keeton", "Kehinde", "Keigan", "Keilan", "Keir", "Keiran", "Keiren", "Keiron", "Keiryn", "Keison", "Keith", "Keivlin", "Kelam", "Kelan", "Kellan", "Kellen", "Kelso", "Kelum", "Kelvan", "Kelvin", "Ken", "Kenan", "Kendall", "Kendyn", "Kenlin", "Kenneth", "Kensey", "Kenton", "Kenyon", "Kenzeigh", "Kenzi", "Kenzie", "Kenzo", "Kenzy", "Keo", "Ker", "Kern", "Kerr", "Kevan", "Kevin", "Kevyn", "Kez", "Khai", "Khalan", "Khaleel", "Khaya", "Khevien", "Khizar", "Khizer", "Kia", "Kian", "Kian-James", "Kiaran", "Kiarash", "Kie", "Kiefer", "Kiegan", "Kienan", "Kier", "Kieran", "Kieran-Scott", "Kieren", "Kierin", "Kiern", "Kieron", "Kieryn", "Kile", "Killian", "Kimi", "Kingston", "Kinneil", "Kinnon", "Kinsey", "Kiran", "Kirk", "Kirwin", "Kit", "Kiya", "Kiyonari", "Kjae", "Klein", "Klevis", "Kobe", "Kobi", "Koby", "Koddi", "Koden", "Kodi", "Kodie", "Kody", "Kofi", "Kogan", "Kohen", "Kole", "Konan", "Konar", "Konnor", "Konrad", "Koray", "Korben", "Korbyn", "Korey", "Kori", "Korrin", "Kory", "Koushik", "Kris", "Krish", "Krishan", "Kriss", "Kristian", "Kristin", "Kristofer", "Kristoffer", "Kristopher", "Kruz", "Krzysiek", "Krzysztof", "Ksawery", "Ksawier", "Kuba", "Kurt", "Kurtis", "Kurtis-Jae", "Kyaan", "Kyan", "Kyde", "Kyden", "Kye", "Kyel", "Kyhran", "Kyie", "Kylan", "Kylar", "Kyle", "Kyle-Derek", "Kylian", "Kym", "Kynan", "Kyral", "Kyran", "Kyren", "Kyrillos", "Kyro", "Kyron", "Kyrran", "Lachlainn", "Lachlan", "Lachlann", "Lael", "Lagan", "Laird", "Laison", "Lakshya", "Lance", "Lancelot", "Landon", "Lang", "Lasse", "Latif", "Lauchlan", "Lauchlin", "Laughlan", "Lauren", "Laurence", "Laurie", "Lawlyn", "Lawrence", "Lawrie", "Lawson", "Layne", "Layton", "Lee", "Leigh", "Leigham", "Leighton", "Leilan", "Leiten", "Leithen", "Leland", "Lenin", "Lennan", "Lennen", "Lennex", "Lennon", "Lennox", "Lenny", "Leno", "Lenon", "Lenyn", "Leo", "Leon", "Leonard", "Leonardas", "Leonardo", "Lepeng", "Leroy", "Leven", "Levi", "Levon", "Levy", "Lewie", "Lewin", "Lewis", "Lex", "Leydon", "Leyland", "Leylann", "Leyton", "Liall", "Liam", "Liam-Stephen", "Limo", "Lincoln", "Lincoln-John", "Lincon", "Linden", "Linton", "Lionel", "Lisandro", "Litrell", "Liyonela-Elam", "LLeyton", "Lliam", "Lloyd", "Lloyde", "Loche", "Lochlan", "Lochlann", "Lochlan-Oliver", "Lock", "Lockey", "Logan", "Logann", "Logan-Rhys", "Loghan", "Lokesh", "Loki", "Lomond", "Lorcan", "Lorenz", "Lorenzo", "Lorne", "Loudon", "Loui", "Louie", "Louis", "Loukas", "Lovell", "Luc", "Luca", "Lucais", "Lucas", "Lucca", "Lucian", "Luciano", "Lucien", "Lucus", "Luic", "Luis", "Luk", "Luka", "Lukas", "Lukasz", "Luke", "Lukmaan", "Luqman", "Lyall", "Lyle", "Lyndsay", "Lysander", "Maanav", "Maaz", "Mac", "Macallum", "Macaulay", "Macauley", "Macaully", "Machlan", "Maciej", "Mack", "Mackenzie", "Mackenzy", "Mackie", "Macsen", "Macy", "Madaki", "Maddison", "Maddox", "Madison", "Madison-Jake", "Madox", "Mael", "Magnus", "Mahan", "Mahdi", "Mahmoud", "Maias", "Maison", "Maisum", "Maitlind", "Majid", "Makensie", "Makenzie", "Makin", "Maksim", "Maksymilian", "Malachai", "Malachi", "Malachy", "Malakai", "Malakhy", "Malcolm", "Malik", "Malikye", "Malo", "Ma'moon", "Manas", "Maneet", "Manmohan", "Manolo", "Manson", "Mantej", "Manuel", "Manus", "Marc", "Marc-Anthony", "Marcel", "Marcello", "Marcin", "Marco", "Marcos", "Marcous", "Marcquis", "Marcus", "Mario", "Marios", "Marius", "Mark", "Marko", "Markus", "Marley", "Marlin", "Marlon", "Maros", "Marshall", "Martin", "Marty", "Martyn", "Marvellous", "Marvin", "Marwan", "Maryk", "Marzuq", "Mashhood", "Mason", "Mason-Jay", "Masood", "Masson", "Matas", "Matej", "Mateusz", "Mathew", "Mathias", "Mathu", "Mathuyan", "Mati", "Matt", "Matteo", "Matthew", "Matthew-William", "Matthias", "Max", "Maxim", "Maximilian", "Maximillian", "Maximus", "Maxwell", "Maxx", "Mayeul", "Mayson", "Mazin", "Mcbride", "McCaulley", "McKade", "McKauley", "McKay", "McKenzie", "McLay", "Meftah", "Mehmet", "Mehraz", "Meko", "Melville", "Meshach", "Meyzhward", "Micah", "Michael", "Michael-Alexander", "Michael-James", "Michal", "Michat", "Micheal", "Michee", "Mickey", "Miguel", "Mika", "Mikael", "Mikee", "Mikey", "Mikhail", "Mikolaj", "Miles", "Millar", "Miller", "Milo", "Milos", "Milosz", "Mir", "Mirza", "Mitch", "Mitchel", "Mitchell", "Moad", "Moayd", "Mobeen", "Modoulamin", "Modu", "Mohamad", "Mohamed", "Mohammad", "Mohammad-Bilal", "Mohammed", "Mohanad", "Mohd", "Momin", "Momooreoluwa", "Montague", "Montgomery", "Monty", "Moore", "Moosa", "Moray", "Morgan", "Morgyn", "Morris", "Morton", "Moshy", "Motade", "Moyes", "Msughter", "Mueez", "Muhamadjavad", "Muhammad", "Muhammed", "Muhsin", "Muir", "Munachi", "Muneeb", "Mungo", "Munir", "Munmair", "Munro", "Murdo", "Murray", "Murrough", "Murry", "Musa", "Musse", "Mustafa", "Mustapha", "Muzammil", "Muzzammil", "Mykie", "Myles", "Mylo", "Nabeel", "Nadeem", "Nader", "Nagib", "Naif", "Nairn", "Narvic", "Nash", "Nasser", "Nassir", "Natan", "Nate", "Nathan", "Nathanael", "Nathanial", "Nathaniel", "Nathan-Rae", "Nawfal", "Nayan", "Neco", "Neil", "Nelson", "Neo", "Neshawn", "Nevan", "Nevin", "Ngonidzashe", "Nial", "Niall", "Nicholas", "Nick", "Nickhill", "Nicki", "Nickson", "Nicky", "Nico", "Nicodemus", "Nicol", "Nicolae", "Nicolas", "Nidhish", "Nihaal", "Nihal", "Nikash", "Nikhil", "Niki", "Nikita", "Nikodem", "Nikolai", "Nikos", "Nilav", "Niraj", "Niro", "Niven", "Noah", "Noel", "Nolan", "Noor", "Norman", "Norrie", "Nuada", "Nyah", "Oakley", "Oban", "Obieluem", "Obosa", "Odhran", "Odin", "Odynn", "Ogheneochuko", "Ogheneruno", "Ohran", "Oilibhear", "Oisin", "Ojima-Ojo", "Okeoghene", "Olaf", "Ola-Oluwa", "Olaoluwapolorimi", "Ole", "Olie", "Oliver", "Olivier", "Oliwier", "Ollie", "Olurotimi", "Oluwadamilare", "Oluwadamiloju", "Oluwafemi", "Oluwafikunayomi", "Oluwalayomi", "Oluwatobiloba", "Oluwatoni", "Omar", "Omri", "Oran", "Orin", "Orlando", "Orley", "Orran", "Orrick", "Orrin", "Orson", "Oryn", "Oscar", "Osesenagha", "Oskar", "Ossian", "Oswald", "Otto", "Owain", "Owais", "Owen", "Owyn", "Oz", "Ozzy", "Pablo", "Pacey", "Padraig", "Paolo", "Pardeepraj", "Parkash", "Parker", "Pascoe", "Pasquale", "Patrick", "Patrick-John", "Patrikas", "Patryk", "Paul", "Pavit", "Pawel", "Pawlo", "Pearce", "Pearse", "Pearsen", "Pedram", "Pedro", "Peirce", "Peiyan", "Pele", "Peni", "Peregrine", "Peter", "Phani", "Philip", "Philippos", "Phinehas", "Phoenix", "Phoevos", "Pierce", "Pierre-Antoine", "Pieter", "Pietro", "Piotr", "Porter", "Prabhjoit", "Prabodhan", "Praise", "Pranav", "Pravin", "Precious", "Prentice", "Presley", "Preston", "Preston-Jay", "Prinay", "Prince", "Prithvi", "Promise", "Puneetpaul", "Pushkar", "Qasim", "Qirui", "Quinlan", "Quinn", "Radmiras", "Raees", "Raegan", "Rafael", "Rafal", "Rafferty", "Rafi", "Raheem", "Rahil", "Rahim", "Rahman", "Raith", "Raithin", "Raja", "Rajab-Ali", "Rajan", "Ralfs", "Ralph", "Ramanas", "Ramit", "Ramone", "Ramsay", "Ramsey", "Rana", "Ranolph", "Raphael", "Rasmus", "Rasul", "Raul", "Raunaq", "Ravin", "Ray", "Rayaan", "Rayan", "Rayane", "Rayden", "Rayhan", "Raymond", "Rayne", "Rayyan", "Raza", "Reace", "Reagan", "Reean", "Reece", "Reed", "Reegan", "Rees", "Reese", "Reeve", "Regan", "Regean", "Reggie", "Rehaan", "Rehan", "Reice", "Reid", "Reigan", "Reilly", "Reily", "Reis", "Reiss", "Remigiusz", "Remo", "Remy", "Ren", "Renars", "Reng", "Rennie", "Reno", "Reo", "Reuben", "Rexford", "Reynold", "Rhein", "Rheo", "Rhett", "Rheyden", "Rhian", "Rhoan", "Rholmark", "Rhoridh", "Rhuairidh", "Rhuan", "Rhuaridh", "Rhudi", "Rhy", "Rhyan", "Rhyley", "Rhyon", "Rhys", "Rhys-Bernard", "Rhyse", "Riach", "Rian", "Ricards", "Riccardo", "Ricco", "Rice", "Richard", "Richey", "Richie", "Ricky", "Rico", "Ridley", "Ridwan", "Rihab", "Rihan", "Rihards", "Rihonn", "Rikki", "Riley", "Rio", "Rioden", "Rishi", "Ritchie", "Rivan", "Riyadh", "Riyaj", "Roan", "Roark", "Roary", "Rob", "Robbi", "Robbie", "Robbie-lee", "Robby", "Robert", "Robert-Gordon", "Robertjohn", "Robi", "Robin", "Rocco", "Roddy", "Roderick", "Rodrigo", "Roen", "Rogan", "Roger", "Rohaan", "Rohan", "Rohin", "Rohit", "Rokas", "Roman", "Ronald", "Ronan", "Ronan-Benedict", "Ronin", "Ronnie", "Rooke", "Roray", "Rori", "Rorie", "Rory", "Roshan", "Ross", "Ross-Andrew", "Rossi", "Rowan", "Rowen", "Roy", "Ruadhan", "Ruaidhri", "Ruairi", "Ruairidh", "Ruan", "Ruaraidh", "Ruari", "Ruaridh", "Ruben", "Rubhan", "Rubin", "Rubyn", "Rudi", "Rudy", "Rufus", "Rui", "Ruo", "Rupert", "Ruslan", "Russel", "Russell", "Ryaan", "Ryan", "Ryan-Lee", "Ryden", "Ryder", "Ryese", "Ryhs", "Rylan", "Rylay", "Rylee", "Ryleigh", "Ryley", "Rylie", "Ryo", "Ryszard", "Saad", "Sabeen", "Sachkirat", "Saffi", "Saghun", "Sahaib", "Sahbian", "Sahil", "Saif", "Saifaddine", "Saim", "Sajid", "Sajjad", "Salahudin", "Salman", "Salter", "Salvador", "Sam", "Saman", "Samar", "Samarjit", "Samatar", "Sambrid", "Sameer", "Sami", "Samir", "Sami-Ullah", "Samual", "Samuel", "Samuela", "Samy", "Sanaullah", "Sandro", "Sandy", "Sanfur", "Sanjay", "Santiago", "Santino", "Satveer", "Saul", "Saunders", "Savin", "Sayad", "Sayeed", "Sayf", "Scot", "Scott", "Scott-Alexander", "Seaan", "Seamas", "Seamus", "Sean", "Seane", "Sean-James", "Sean-Paul", "Sean-Ray", "Seb", "Sebastian", "Sebastien", "Selasi", "Seonaidh", "Sephiroth", "Sergei", "Sergio", "Seth", "Sethu", "Seumas", "Shaarvin", "Shadow", "Shae", "Shahmir", "Shai", "Shane", "Shannon", "Sharland", "Sharoz", "Shaughn", "Shaun", "Shaunpaul", "Shaun-Paul", "Shaun-Thomas", "Shaurya", "Shaw", "Shawn", "Shawnpaul", "Shay", "Shayaan", "Shayan", "Shaye", "Shayne", "Shazil", "Shea", "Sheafan", "Sheigh", "Shenuk", "Sher", "Shergo", "Sheriff", "Sherwyn", "Shiloh", "Shiraz", "Shreeram", "Shreyas", "Shyam", "Siddhant", "Siddharth", "Sidharth", "Sidney", "Siergiej", "Silas", "Simon", "Sinai", "Skye", "Sofian", "Sohaib", "Sohail", "Soham", "Sohan", "Sol", "Solomon", "Sonneey", "Sonni", "Sonny", "Sorley", "Soul", "Spencer", "Spondon", "Stanislaw", "Stanley", "Stefan", "Stefano", "Stefin", "Stephen", "Stephenjunior", "Steve", "Steven", "Steven-lee", "Stevie", "Stewart", "Stewarty", "Strachan", "Struan", "Stuart", "Su", "Subhaan", "Sudais", "Suheyb", "Suilven", "Sukhi", "Sukhpal", "Sukhvir", "Sulayman", "Sullivan", "Sultan", "Sung", "Sunny", "Suraj", "Surien", "Sweyn", "Syed", "Sylvain", "Symon", "Szymon", "Tadd", "Taddy", "Tadhg", "Taegan", "Taegen", "Tai", "Tait", "Taiwo", "Talha", "Taliesin", "Talon", "Talorcan", "Tamar", "Tamiem", "Tammam", "Tanay", "Tane", "Tanner", "Tanvir", "Tanzeel", "Taonga", "Tarik", "Tariq-Jay", "Tate", "Taylan", "Taylar", "Tayler", "Taylor", "Taylor-Jay", "Taylor-Lee", "Tayo", "Tayyab", "Tayye", "Tayyib", "Teagan", "Tee", "Teejay", "Tee-jay", "Tegan", "Teighen", "Teiyib", "Te-Jay", "Temba", "Teo", "Teodor", "Teos", "Terry", "Teydren", "Theo", "Theodore", "Thiago", "Thierry", "Thom", "Thomas", "Thomas-Jay", "Thomson", "Thorben", "Thorfinn", "Thrinei", "Thumbiko", "Tiago", "Tian", "Tiarnan", "Tibet", "Tieran", "Tiernan", "Timothy", "Timucin", "Tiree", "Tisloh", "Titi", "Titus", "Tiylar", "TJ", "Tjay", "T-Jay", "Tobey", "Tobi", "Tobias", "Tobie", "Toby", "Todd", "Tokinaga", "Toluwalase", "Tom", "Tomas", "Tomasz", "Tommi-Lee", "Tommy", "Tomson", "Tony", "Torin", "Torquil", "Torran", "Torrin", "Torsten", "Trafford", "Trai", "Travis", "Tre", "Trent", "Trey", "Tristain", "Tristan", "Troy", "Tubagus", "Turki", "Turner", "Ty", "Ty-Alexander", "Tye", "Tyelor", "Tylar", "Tyler", "Tyler-James", "Tyler-Jay", "Tyllor", "Tylor", "Tymom", "Tymon", "Tymoteusz", "Tyra", "Tyree", "Tyrnan", "Tyrone", "Tyson", "Ubaid", "Ubayd", "Uchenna", "Uilleam", "Umair", "Umar", "Umer", "Umut", "Urban", "Uri", "Usman", "Uzair", "Uzayr", "Valen", "Valentin", "Valentino", "Valery", "Valo", "Vasyl", "Vedantsinh", "Veeran", "Victor", "Victory", "Vinay", "Vince", "Vincent", "Vincenzo", "Vinh", "Vinnie", "Vithujan", "Vladimir", "Vladislav", "Vrishin", "Vuyolwethu", "Wabuya", "Wai", "Walid", "Wallace", "Walter", "Waqaas", "Warkhas", "Warren", "Warrick", "Wasif", "Wayde", "Wayne", "Wei", "Wen", "Wesley", "Wesley-Scott", "Wiktor", "Wilkie", "Will", "William", "William-John", "Willum", "Wilson", "Windsor", "Wojciech", "Woyenbrakemi", "Wyatt", "Wylie", "Wynn", "Xabier", "Xander", "Xavier", "Xiao", "Xida", "Xin", "Xue", "Yadgor", "Yago", "Yahya", "Yakup", "Yang", "Yanick", "Yann", "Yannick", "Yaseen", "Yasin", "Yasir", "Yassin", "Yoji", "Yong", "Yoolgeun", "Yorgos", "Youcef", "Yousif", "Youssef", "Yu", "Yuanyu", "Yuri", "Yusef", "Yusuf", "Yves", "Zaaine", "Zaak", "Zac", "Zach", "Zachariah", "Zacharias", "Zacharie", "Zacharius", "Zachariya", "Zachary", "Zachary-Marc", "Zachery", "Zack", "Zackary", "Zaid", "Zain", "Zaine", "Zaineddine", "Zainedin", "Zak", "Zakaria", "Zakariya", "Zakary", "Zaki", "Zakir", "Zakk", "Zamaar", "Zander", "Zane", "Zarran", "Zayd", "Zayn", "Zayne", "Ze", "Zechariah", "Zeek", "Zeeshan", "Zeid", "Zein", "Zen", "Zendel", "Zenith", "Zennon", "Zeph", "Zerah", "Zhen", "Zhi", "Zhong", "Zhuo", "Zi", "Zidane", "Zijie", "Zinedine", "Zion", "Zishan", "Ziya", "Ziyaan", "Zohaib", "Zohair", "Zoubaeir", "Zubair", "Zubayr", "Zuriel"];
    this.id = Math.random();
    this.username = displayNames[Math.floor(Math.random()*displayNames.length)]
    this.role = role;
    this.x = x;
    this.y = y;
    this.r = this.tr = this.baseRotation = this.baseFrame = this.mode = this.pushback = this.immune = this.shields = 0;
    this.barrelSpeed = Math.random()*3+2;
    this.rank = rank;
    this.team = team.includes(':') ? team : this.username+':'+team;
    this.host = host;
    this.hp = rank * 10 + 300;
    this.maxHp = this.hp;
    this.seeUser = this.target = this.fire = this.obstruction = this.bond = this.path = this.damage = false;
    this.canFire = this.canPowermissle = this.canBoost = this.canBashed = true;
    if (Math.random() < (rank/20)) this.canItem0 = true;
    if (Math.random() < (rank/20)) this.canItem1 = true;
    if (Math.random() < (rank/20)) this.canItem2 = true;
    if (Math.random() < (rank/20)) this.canItem3 = true;
    if (Math.random() < (rank/20)) this.canClass = true;
    this.items = [];
    if (this.role !== 0) this.giveAbilities();
    const summoner = host.pt.find(t => t.username === Engine.getUsername(this.team));
    if (summoner) {
      this.cosmetic_hat = summoner.cosmetic_hat;
      this.cosmetic = summoner.cosmetic;
      this.cosmetic_body = summoner.cosmetic_body;
      this.color = summoner.color;
    } else {
      this.color = Engine.getRandomColor();
    }
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + (role === 0 ? .99 : .79)))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + (role === 0 ? .99 : .79))));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    this.lookInterval = setInterval(() => this.identify(), 500);
  }

  giveAbilities() {
    const available = ['airstrike', 'super_glu', 'duck_tape', 'shield', 'flashbang', 'bomb', 'dynamite', 'usb', 'weak', 'strong', 'spike', 'reflector'];
    const classes = ['tactical', 'stealth', 'warrior', 'builder', 'fire', 'medic'];
    for (let i = 0; i < 4; i++) this.items.push(available[Math.floor(Math.random()*available.length)]);
    this.class = classes[Math.floor(Math.random()*classes.length)];
  }

  think() {
    if (this.role !== 0) this.move();
    if (this.obstruction && !this.seeTarget) {
      this.tr = Engine.toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40));
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/600) this.fireCalc(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire) this.fireCalc(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.tr = Engine.toAngle(this.target.x - this.x, this.target.y - this.y);
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/600) this.fireCalc(this.target.x, this.target.y, 'powermissle');
      if (this.canFire) this.fireCalc(this.target.x, this.target.y);
    }
    if (this.canClass && this.mode !== 0 && Math.random() < 1/300) {
      let cooldown = 0;
      if (this.class === 'tactical') {
        this.fireCalc(this.target.x, this.target.y, 'megamissle');
        cooldown = 25000;
      } else if (this.class === 'stealth') {
        this.host.useAbility(this, 'invis');
        cooldown = 40000;
      } else if (this.class === 'builder') {
        this.host.useAbility(this, 'turret');
        cooldown = 20000;
      } else if (this.class === 'warrior') {
        this.host.useAbility(this, 'buff');
        cooldown = 40000;
      } else if (this.class === 'medic') {
        this.host.useAbility(this, 'healwave'); // greedy self-heal :D
        cooldown = 30000;
      } else if (this.class === 'fire') {
        for (let i = -30, len = 30; i < len; i += 5) A.template('Shot').init(this.x+40, this.y+40, this.r+90+i, 'fire', this.team, this.rank, this.host);
        cooldown = 10000;
      }
      this.canClass = false;
      setTimeout(() => {
        this.canClass = true;
      }, cooldown);
    }
    for (let i = 0; i < 4; i++) {
      if (this['canItem'+i] && Math.random() < 1/300) {
        const item = this.items[i];
        let cooldown = 0;
        if (item === 'airstrike') {
          if (this.mode !== 0) {
            this.host.useAbility(this, 'airstrike'+this.target.x+'x'+this.target.y);
            cooldown = 20000;
          }
        } else if (item === 'super_glu') {
          if (this.hp < this.maxHp*.75) {
            this.host.useAbility(this, 'glu');
            cooldown = 30000;
          }
        } else if (item === 'duck_tape') {
          if (this.hp < this.maxHp*.75) {
            this.host.useAbility(this, 'tape');
            cooldown = 30000;
          }
        } else if (item === 'shield') {
          if (this.shields === 0) {
            this.host.useAbility(this, 'shield');
            cooldown = 30000;
          }
        } else if (item === 'flashbang') {
          this.host.useAbility(this, 'flashbang');
          cooldown = 20000;
        } else if (item === 'bomb') {
          if (this.obstruction) {
            this.host.useAbility(this, 'bomb');
            cooldown = 5000;
          }
        } else if (item === 'dynamite') {
          // lol no :)
        } else if (item === 'usb') {
          // idk
        } else if (item === 'weak') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#weak');
            cooldown = 4000;
          }
        } else if (item === 'strong') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#strong');
            cooldown = 8000;
          }
        } else if (item === 'spike') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#spike');
            cooldown = 10000;
          }
        } else if (item === 'reflector') {
          if (this.mode !== 0) {
            this.host.useAbility(this, 'reflector');
            cooldown = 10000;
          }
        }
        if (cooldown !== 0) {
          this['canItem'+i] = false;
          setTimeout(() => {
            this['canItem'+i] = true;
          }, cooldown);
        }
      }
    }
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  update() {
    this.think();
    if (!this.target && this.role === 0) this.r++;
    if (!(this.role === 0 && this.mode === 0)) {
      const diff = (this.tr-this.r+360)%360, dir = diff < 180 ? 1 : -1;
      this.r = diff > this.barrelSpeed ? (this.r+dir*this.barrelSpeed+360)%360 : this.tr;
    }
    const team = Engine.getTeam(this.team);
    /*if (this.dedEffect) {
      this.dedEffect.time = Date.now() - this.dedEffect.start;
      this.setValue('dedEffect', this.dedEffect); // REMOVE THIS TEMPORARY
    } No death effects for AI yet...*/
    if (this.pushback !== 0) this.pushback += 0.5;
    if (this.fire && Engine.getTeam(this.fire.team) !== Engine.getTeam(this.team)) this.damageCalc(this.x, this.y, .25, Engine.getUsername(this.fire.team));
    if (this.damage) this.damage.y--;
    // if (this.grapple) this.grappleCalc(); No grapple for AI yet...
    if (this.reflect) {
      const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
      for (let i = Math.max(0, hx-2); i <= Math.min(29, hx+2); i++) for (let l = Math.max(0, hy-2); l <= Math.min(29, hy+2); l++) {
        for (const entity of this.host.cells[i][l]) {
          if (entity instanceof Shot) {
            const xd = entity.x-(this.x+40), yd = entity.y-(this.y+40), td = Math.sqrt(xd**2+yd**2);
            const aspectRatio = 6/td;
            if (td > 150) continue;
            entity.e = Date.now();
            entity.sx = entity.x;
            entity.sy = entity.y;
            entity.xm = xd*aspectRatio;
            entity.ym = yd*aspectRatio;
            entity.r = Engine.toAngle(xd, yd);
            if (entity.type !== 'grapple') entity.team = this.team;
          }
        }
      }
    }
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      for (const entity of this.host.cells[x][y]) {
        const teamMatch = team === Engine.getTeam(entity.team);
        if (entity instanceof Block) {
          if (!this.ded && this.immune+500 < Date.now() && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) {
            if (entity.type === 'fire') {
              if (this.fire) {
                clearTimeout(this.fireTimeout);
                this.fire = {team: entity.team, frame: this.fire.frame};
              } else {
                this.fire = {team: entity.team, frame: 0};
                this.fireInterval ??= setInterval(() => this.fire.frame ^= 1, 50);
              }
              this.fireTimeout = setTimeout(() => {
                clearInterval(this.fireInterval);
                this.fire = false;
              }, 4000);
            } else if (entity.type === 'spike' && !teamMatch) this.damageCalc(this.x, this.y, 1, Engine.getUsername(entity.team));
          }
        } else if (entity instanceof Tank || entity instanceof AI) {
          if (entity.buff && !this.ded && this.immune+500 < Date.now() && this.canBashed && Engine.getTeam(entity.team) !== Engine.getTeam(this.team) && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 80, 80)) {
            this.canBashed = false;
            setTimeout(() => {this.canBashed = true}, 1000);
            this.damageCalc(this.x, this.y, 100, Engine.getUsername(entity.team));
          }
        }
      }
    }
  }

  move() {
    const {x, y, path, baseRotation} = this;
    if ((x-10)%100 === 0 && (y-10)%100 === 0) this.onBlock();
    if (!path || !path.p.length) return;
    const now = Date.now();
    const len = path.p.length-1;
    let frames = Math.min(Math.floor((now-path.t)/15), len*25);
    if (this.immune+500 > path.t) frames = Math.min(frames+3*Math.floor(Math.min(now-Math.max(this.immune, path.t), this.immune+500-path.t)/15), len*25);
    const f = Math.floor(frames/25);
    const n = Math.min(f+1, len);
    const dx = path.p[n][0]-path.p[f][0], dy = path.p[n][1]-path.p[f][1];
    const offset = 4*(frames%25);
    const nx = 10+path.p[f][0]*100+offset*dx, ny = 10+path.p[f][1]*100+offset*dy;
    this.baseRotation = [[135, 180, 225], [90, baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    this.obstruction = this.collision(nx, ny);
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/300) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => {this.canBoost = true}, 5000);
      }
      this.x = nx;
      this.y = ny;
    } else {
      this.path.t = this.path.o+Date.now()-this.obstruction.t;
    }
    const cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + (this.role === 0 ? .99 : .79)))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + (this.role === 0 ? .99 : .79))));
      this.host.cells[cx][cy].add(this);
      cells.add(cx+'x'+cy);
    }
    for (const cell of [...this.cells].filter(c => !cells.has(c))) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    this.cells = cells;
  }

  collision(x, y) {
    for (const b of this.host.b) if (Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return {x: b.x+50, y: b.y+50, t: this.obstruction ? this.obstruction.t : Date.now()};
    return false;
  }

  onBlock() {
    if (!this.path) this.generatePath();
    if (!this.path.p || !this.path.p.length) this.generatePath();
    if (this.path.p && this.path.p.length > 0) {
      const final = this.path.p[this.path.p.length - 1];
      if ((this.x - 10) / 100 === final[0] && (this.y - 10) / 100 === final[1]) this.generatePath();
    }
  }

  generatePath() {
    const sx = (this.x-10)/100, sy = (this.y-10)/100;
    let cir, coords = [], limiter, tpx, tpy, epx, epy;
    let tx = Math.floor((this.target.x+40)/100), ty = Math.floor((this.target.y+40)/100), ranged = Math.max(sx-tx, sy-ty) > [1, 5, 5][this.role-1];
    if (this.role === 3 && this.bond) {
      epx = Math.floor((this.bond.x+40)/100);
      epy = Math.floor((this.bond.y+40)/100);
    } else if (this.mode === 0 || (this.mode === 1 && ranged) || this.mode === 2) {
      epx = sx;
      epy = sy;
    } else if (this.mode === 1) {
      epx = tx;
      epy = ty;
    } else {
      epx = sx;
      epy = sy;
    }
    if ((this.role === 3 && this.bond) || (this.role === 1 && this.mode === 1 && !ranged)) {
      cir = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    } else cir = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
    if ((this.role === 3 && this.bond) || (this.mode === 1 && !ranged)) {
      tpx = sx;
      tpy = sy;
    } else if (this.mode === 0) {
      const d = Engine.toPoint(this.r);
      tpx = d.x+epx;
      tpy = d.y+epy;
    } else if (this.mode === 2 || (this.mode === 1 && ranged)) {
      tpx = tx;
      tpy = ty;
    }
    if (this.role === 3 && this.bond) {
      limiter = [2];
    } else if (this.role === 1 && !ranged) {
      limiter = [2, 3];
    } else {
      limiter = [2, 3, 4];
    }
    for (const c of cir) {
      const x = c[0]+epx, y = c[1]+epy, d = (x-tpx)**2+(y-tpy)**2;
      if (x >= 0 && y >= 0 && x <= 29 && y <= 29) coords.push({x, y, d});
    }
    if (!coords.length) return this.path = {p: [], m: this.mode, t: Date.now(), o: Date.now()};
    coords.sort((a, b) => this.mode !== 2 ? a.d - b.d : b.d - a.d);
    for (let i = 0; i <= this.mode === 0 ? coords.length : 5; i++) {
      const r = this.choosePath(coords.length);
      const {x, y} = coords[r];
      const p = Engine.pathfind(sx, sy, x, y, this.host.map.clone());
      if (limiter.includes(p.length) || true) return this.path = {p, m: this.mode, t: Date.now(), o: Date.now()};
      coords.splice(r, 1);
      if (!coords.length) return this.path = {p: [], m: this.mode, t: Date.now(), o: Date.now()}; 
    }
    if (this.mode !== 0) this.path = {p: Engine.pathfind(sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()}; 
  }

  choosePath(p) {
    return Math.floor(Math.random()*p);
  }

  identify() {
    let previousTargetExists = false;
    const tanks = this.host.pt.concat(this.host.ai).sort((a, b) => {
      if ((a.id === this.target.id && !a.ded) || (b.id === this.target.id && !b.ded)) previousTargetExists = true;
      return (a.x-this.x)**2+(a.y-this.y)**2 > (b.x-this.x)**2+(b.y-this.y)**2;
    });
    let target = false, bond = false;
    for (const t of tanks) {
      if (t.ded || t.invis || !Engine.raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b) || t.id === this.id || ((t.x-this.x)**2+(t.y-this.y)**2)**.5 > 800) continue;
      if (Engine.getTeam(t.team) === Engine.getTeam(this.team)) {
        if (!bond && t.role !== 3 && t.role !== 0) bond = t;
      } else {
        if (!target) target = t;
      }
      if (target && (bond || this.role !== 3)) break;
    }
    if (bond) this.bond = bond; 
    if (!target) {
      if (this.target) {
        this.seeTarget = false;
        if (!this.seeTimeout) this.seeTimeout = setTimeout(() => {
          this.mode = 0;
          this.target = false;
        }, previousTargetExists ? 10000 : 0);
      }
    } else {
      if (this.target) this.seeTimeout = clearTimeout(this.seeTimeout);
      this.seeTarget = true;
      this.target = {x: target.x, y: target.y, id: target.id};
      this.mode = (this.hp < .3 * this.maxHp && this.role !== 1) ? 2 : 1;
    }
  }

  fireCalc(tx, ty, type) {
    this.pushback = type && type.includes('missle') ? -9 : -6;
    if (type === undefined) type = this.role !== 0 && Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2) < 150 ? 'shotgun' : 'bullet';
    for (let [i, len] = type === 'shotgun' ? [-10, 15] : [0, 1]; i < len; i += 5) {
      A.template('Shot').init(this.x+40, this.y+40, this.r+90+i, type, this.team, this.rank, this.host);
    }
    if (type === 'powermissle') {
      this.canPowermissle = false;
      setTimeout(() => {this.canPowermissle = true}, 10000);
    } else if (type !== 'megamissle') {
      this.canFire = false;
      setTimeout(() => {this.canFire = true}, type === 'shotgun' ? 600 : 200);
    }
  }

  damageCalc(x, y, a, u) {
    if (this.immune+500 > Date.now() || this.reflect) return;
    const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
    for (let i = Math.max(0, hx-1); i <= Math.min(29, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(29, hy+1); l++) for (const entity of this.host.cells[i][l]) {
      if (entity instanceof Shot) if (entity.target) if (entity.target.id === this.id && entity.type === 'usb') a *= Engine.getTeam(entity.team) === Engine.getTeam(this.team) ? .9 : 1.1;
    }
    if (this.shields > 0 && a > 0) return this.shields -= a;
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    this.hp -= a;
    clearInterval(this.healInterval);
    clearTimeout(this.healTimeout);
    if (this.hp <= 0) {
      if (this.host.ondeath/* && this.role !== 0*/) this.host.ondeath(this, this.host.pt.concat(this.host.ai).find(t => t.username === u));
      return this.destroy();
    }
    this.healTimeout = setTimeout(() => {
      this.healInterval = setInterval(() => {
        this.hp = Math.min(this.hp+.4, this.maxHp);
      }, 15);
    }, 10000);
  }

  destroy() {
    clearInterval(this.lookInterval);
    const index = this.host.ai.indexOf(this);
    if (index !== -1) this.host.ai.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
  }
}
