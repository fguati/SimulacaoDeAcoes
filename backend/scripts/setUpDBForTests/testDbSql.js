//SQL for creating the DB that will be used in the backend tests. Tests were written already considering the data below and changing, removing or changing the order of the entries would require reviewing the tests

const userDbSql = `INSERT INTO users (username, email, hashed_password, salt) 
VALUES  ("Testget", "test@get", "3a02078363bb72fd562ef80a18fed3ff05b1e80622283ea6d85ccb7fdafe8c4f0a56cfae66c8bf4e563c6fe9df230c2242e028257444cb009a778804ee5af8ae", "fcc0b7a1afedba35190f7f30f71e1a17cac0c7690f97c82cf05e8cf267aa439e0f6024ca692be52d75d13c7b5a2775a50d32644b359287ee36642de8b3c8bffc255a46272136cce657f3ed8a6eaf791f162cf3d66411fa73c6d93271a3fa6ce94a9a7ed3d6e8ee4c2f502ccb2c365f4ace8a3d2425b9aba13c0672e306999f87"),
        ("TestSelectByEmail", "test@selectbyemail", "22b807a93b870459e24134565b4e28dd8fec162be68b3dbbcda017bfe80160a6ae3ccbacf399cf839ce8dd4037a501fbaffb4630ea37eaf9f9434741c3b17d6b", "aed6c45d39b7ac02808b261aa1d2c77d5fc266fe0b63491ac225367024f9dda9767e5630f42edcfa4420a14efcb89a05dd6f27583505e3d890e878dab65a5830c0b332c103bf851b34562ad1b32374231971ca71729c7c97b047870abe8a0b289424c1eb420b1f154c700c961369a71615353eaf175e8128c4403413d8ca4d07"),
        ("TestDAODelete", "testDAO@delete", "c1919704fb59beecb35114c6f44ea15860c306a235c7f9c6cdc4cb6a51ba4d2b1c18730714b54f9c66a579357a4e02df62cee25b1ac95ad45bb9c081f401e08a", "ca149aada51bee0f3bd71c7606347e88d3402a9c077b870e45bcedefa1996b65241834a9752de095fd6d9fb78c71318f89d4c90d7336afce4c32ed4a3fb191b36ca194445f143f53042e578917a38ee5b9312807318b27294f5859bded58ab90b4a0a69c84e11973945e1c463af5ea29362e6de4b24598ceedaff43ddd66df03"),
        ("GETuserRouteTest", "getuser@routetest", "90a84a82b4e61882e6c15cdf869ac7961d0d45c78359bd435f911cf7bf457b7d5e9ce6013a705c9aa53f6ba3444442d711733136bfe654ab1af9a42661ed2f66", "fd6f211203c17228298fe88a2b4c9b81b67a14608b61519f6a16cfe225205647c143077ea68daa77b30e5fbfc169a0ed432be6d734c70704a1e10d2ccad96456603fd0bc1da25e50d2a46008bc6177140362c11b79ea04b5fed0178265937824318c49074da8ee96d04d61ccd26138ba6686b8733b4666cf811058de88b26af7"),
        ("validLoginUser", "validlogin@user", "31bcec7bdf8abb63e0b8d6cc5bcf33da15832604a8d2bb2fe79967ef3bbfa4550dd748271bc9b78ee298f1aedc603ac240ea861d66a9e946eafa4631f805dbc2", "35fc818dbb42e3aeef9c6f2bd541e4d837720046e3691e56bdd4fec4e83e9dda8a7ab1bd55fd13a4159862fa1ed2b4b1b95bf1fea9f1f5b07ba22b22ede6e88147bc3a795bba750131aa1538b2335ac1c59d59ca14660ce887ff53fe89853745c14696d264d0dbecd09c0138bfef8293e054dc17264257f4ecc22af554f54992"),
        ("POSTuserRouteRepeatedEmailTest", "postuser@routerepeatedemail.test", "26d0fa91330c10c9a52e1beeb8c39ff8e557f92978128441ca7bba2549a865dd98252a876a44714a2e56850dfd1c09d35fd06931dadd9907f77b945b14f8cc71", "5e1c82425c15c5c65ee35904c29afc4240158a4dceb608e81735f36841aaff1b3b3ed729916faebf3953329edc384fc14f898457e16be1b53de0c170e5a101f34f5777db33f41b6758abdad2b9622b99a648b82369897c2aaf2bc37888842b2ab35f3aa44512bdecc90c3e2df7fb5661c88c0da239f0d7569dc935190c804ac3" ),
        ("RegisterUserRouteRepeatedEmailTest", "registeruser@routerepeatedemail", "5d38579b957d602341a47b791c6bbb2427e91b5694ed5782178e355bbe31bf2a915952bcd38ae1f86b50dcaf1dfa5c0ae64da2ec28e8f2f08a39c2924f5daa26", "44a4c63285a6031bf5d612b67b9ed10ed0caf5532309d3c73874a61196d423f8932667e825ea962aff0e345d274fafb20d1a3f251711ad4157df7c266504b6e6d18b1d272aed45c3d0bdfed3a7bc15616a0aa1501ad9bae705dd24243b02c0ee0a99fb5fb767a84f1702737c7d390c7b58cca36374d0ded5bc1f0caa3c15766e"),
        ("TestPositionDAOInsertByEmailMethod", "createPosition@byEmail.test", "f490f1fa3d9651a99ec72d35d66d2f44c5eba129a13f77ad164b52e44af2e471c3bfd03bf39cfe6baec4c3045178d31a9e3ceaf578bab4cf678d33d065b8c475", "b48dfb0ce18589b6a90ed9a92f7ba07da118fb09d4ec69748f2535f14303b20bee957b11bb13eae91acfa1d7de76690a00c282b3583992c73a5537ee99a55a8087c258b6a7770a70c999086b14bf4f76965254f28ec398461b4dfba0762f10f3d7ce63eb64d22ebc6bb3fb84dba475f50f06ed51ad6065b1d31971b185da81e9"),
        ("TestSelectPositionByUserEmail", "testSelectPostition@byUser.Email", "eb8f13aaa5f2648045f639fa78dfa995e5c26e957f89cff8e8c4cbd54a4ff2aea4ada6c18846bc92ab62ad6a8ea6ea0d4994bac84f0fe2069336593e4ff0a6d8", "759fd9fda80e7bc923d92e8159e88108109caf518ea6555805c7f9d343b742cfb7a3af5bba120f8535cee7ddb03b751f8ebf597ee9bd2dc5a92ccafe5423a459517f12d24fd236bde272b02ef07bf7be348099fe5d62bec34961a115aa875b3f36569fa32ce31ee44e35c4496c80198e9860685fa93c53bbada8a17f5b45dd2d"),
        ("userWithNoStocks", "user@withnostocks.email", "929722c1083f7ccd87b43555a6fa8cc1f6aa852a89f67cb1daf2e378c09326930ab9ce2db23cd02f66f918e061956a5c26b3c1dd6d79917d063965d8038ac204", "e88093461ac08a379a8d394c9ea17f6fcdadde76d1b226537530bac50ea7f4f1a9f1e621d0f1acfda374d5b133b8e522787e90ac46591f576b4335adf4903c4812aab10ef59f0bb6503e54e7653e9e0cb15a1dc08c3ece97f0550e2eba81a85befc6d6aefae953eaf68fc17a9a3af4e679b802353d5acf391d6f5f3e6033da6d"),
        ('userWithPositionToDelete', 'userWithPosition@toBeDeleted.com', "0365ce6a8b4aaad5176ff92b79a3f6727d4e3f76882cf7a4f657adb47e994de60a9ab380be37de9a4d2aa94efbbd2c103e91bd224d2981bd7e42f782786d7897", "d5614bb4d829b68841b57579d0435db4064c90029306942b82157becc3d99fd31694ff1125ed94826a9a6854c86fdc56868601e4ebe6b7d8160bdbd1fd06f56f42ad2d57d7d03ad1eaa581d67a5a522efd4f088b0943b0c8a94b6e9d9cd2a3eab9e3caa5494b777e5da05fefc0f0855fd29dc25ffdda1620bb8fe969bdd1330a"),
        ('userWithPositionToUpdate', 'user@WithPositionToUpdate.com', '471fc71e43bf535e7bd16bce291687fa248506cc93a5ba1f0bfe1369d923948410a13e6cd51ccdce71bf63941e96f89eb648b7230fec231fcab287caa8a70482', 'f720e0911464e933d853b466f811054860d6de2be3db6a44ee08a73a7974808ef70bbb85abc673b90746342315f294178fd07d4ec2913e8501beab21638ebb47a71a23757205154d62fa1491ac1dfb6a660ddfb6f90d66febfec2776a068b635b82f1416607a462b63230a984634ba6c098b1c3c907d09ebf9d353ff87a32fdd'),
        ('userToHaveUpdateError', 'user@WithErrorUpdatePosition.com', '123', '123'),
        ('userWithNegotiationHistory', 'user@withNegotiationHistory.com', '13', '123'),
        ('alternateUserWithNegotiationHistory', 'alternanteUser@withNegotiationHistory.com', '13', '123'),
        ('userToTestBalanceChanges', 'user@ToTestBalanceChanges.com', 'efb97a92dda086b5b252119dac0c17caefe2ea0be9aa7dadc1dea46eb980b3db8e625703036d06023796d9a2b29f64558ebce4a93686e4c60970d1efe9d8851f', '23e6699dc40684bfdad15f0b577287022ee84cd337f53c74712e887518d06ac30f62fbbbd29402291fad39bdc623d0a4ea417a9f92a3eff19d3ba14fb31445ad75904614131dc1b97d2333cb004aa4e5d92615a1cc30912c07d4b97a393d059d7ad94a4a9d721580c00289d79463d59a4d26a8b89a74b5cf5a341aeabe8b4d6d'),
        ('userBalanceControllerTest', 'UserBalance@Controller.com', '9e725ac94613124a16d5096082bd2fef12242ff8aca2d77ebb93cb00e1980e9b78960668ba6fb7700f2196e86a5fed3936f55d0a8c1e352c01aa15591d266af0', 'ecbbc36a356b494f64c4cf77fa302739291d40d021bcce512f929a61889b67cec0646731a5d07fa5694bcdeb16f468b6d5a701cbf5798b8870fa6e9b89b5f878ea5f62cfc244c180f7c7aeb43f8cc2f82e915744f9a7ee3b4a4b603eff15294525c72ef2d09b462a0be968b80ddd0eb0c1f3e70253f9c23f0b814031122a0b77'),
        ('testDepositFundsRoute', 'depositFunds@routeTest.com', 'fd506281c9b034e5f9d587a7e3f56c924734e900f4c831c228b2d1c76ee785aacb253241301bbd7cce9fa45dc2e576e2db12e6d5c4b5dcc757c714d328bb7515', '6d7864d82902474233a5b17ea0af7c2379b1de812760f3d6d08d5b915d25570286460bff19682c74bb87b73ed9ad53452aae404b8398fa775430f2395ed718d26b40253a9e0ce329c9cb5b40e1f2f29190dba68aa953632a418d8ae6d44770bace723c4f75c34dbf0c2fc1a167299a865ba302a607623dfa8559c8e05882db63');

`

const positionDbSql = `INSERT INTO stock_positions (user_id, stock_ticker, stock_qty, stock_avg_price) 
VALUES  ("1", "LEVE3", 10, 17.93),
        ("1", "FLRY3", 70, 107.93),
        ("1", "ITSA4", 12, 7.93),
        ("9", "LEVE3", 10, 17.93),
        ("9", "FLRY3", 70, 107.93),
        ("9", "ITSA4", 12, 7.93),
        ("2", "B3SA3", 25, 42.95),
        ("3", "EGIE3", 125, 31.94),
        ("11", "ITSA3", 12, 12.00), --position to be deleted, id 9
        ("12", "LEVE3", 5, 13.45), --position to be updated, id 10
        ("13", "LEVE3", 1, 1.00);  

`

const negotiationDbSql = `INSERT INTO negotiations (user_id, stock_ticker, negotiated_qty, negotiated_price, negotiation_type)
VALUES  ("14", "TAEE11", 100, 10.45, "BUY"),
        ("14", "LEVE3", 100, 10.45, "SELL"),
        ("15", "ALZR11", 100, 10.45, "BUY"),
        ("15", "TAEE11", 100, 10.45, "BUY"),
        ("15", "XPML11", 100, 10.45, "SELL"),
        ("14", "BBSE3", 27, 23.47, "SELL"), --negotiation that will be updated,
        ("14", "BBSE3", 27, 23.47, "SELL") --negotiation that will be deleted: id 7;
`
module.exports = { userDbSql, positionDbSql, negotiationDbSql }