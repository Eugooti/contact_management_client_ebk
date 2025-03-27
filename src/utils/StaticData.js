export const countiesOfKenya = [
    { county: "Mombasa", capital: "Mombasa", countyCode: "001", region: "Coast" },
    { county: "Kwale", capital: "Kwale", countyCode: "002", region: "Coast" },
    { county: "Kilifi", capital: "Kilifi", countyCode: "003", region: "Coast" },
    { county: "Tana River", capital: "Hola", countyCode: "004", region: "Coast" },
    { county: "Lamu", capital: "Lamu", countyCode: "005", region: "Coast" },
    { county: "Taita Taveta", capital: "Mwatate", countyCode: "006", region: "Coast" },
    { county: "Garissa", capital: "Garissa", countyCode: "007", region: "North Eastern" },
    { county: "Wajir", capital: "Wajir", countyCode: "008", region: "North Eastern" },
    { county: "Mandera", capital: "Mandera", countyCode: "009", region: "North Eastern" },
    { county: "Marsabit", capital: "Marsabit", countyCode: "010", region: "Eastern" },
    { county: "Isiolo", capital: "Isiolo", countyCode: "011", region: "Eastern" },
    { county: "Meru", capital: "Meru", countyCode: "012", region: "Eastern" },
    { county: "Tharaka Nithi", capital: "Kathwana", countyCode: "013", region: "Eastern" },
    { county: "Embu", capital: "Embu", countyCode: "014", region: "Eastern" },
    { county: "Kitui", capital: "Kitui", countyCode: "015", region: "Eastern" },
    { county: "Machakos", capital: "Machakos", countyCode: "016", region: "Eastern" },
    { county: "Makueni", capital: "Wote", countyCode: "017", region: "Eastern" },
    { county: "Nyandarua", capital: "Ol Kalou", countyCode: "018", region: "Central" },
    { county: "Nyeri", capital: "Nyeri", countyCode: "019", region: "Central" },
    { county: "Kirinyaga", capital: "Kerugoya", countyCode: "020", region: "Central" },
    { county: "Murang'a", capital: "Murang'a", countyCode: "021", region: "Central" },
    { county: "Kiambu", capital: "Kiambu", countyCode: "022", region: "Central" },
    { county: "Turkana", capital: "Lodwar", countyCode: "023", region: "Rift Valley" },
    { county: "West Pokot", capital: "Kapenguria", countyCode: "024", region: "Rift Valley" },
    { county: "Samburu", capital: "Maralal", countyCode: "025", region: "Rift Valley" },
    { county: "Trans-Nzoia", capital: "Kitale", countyCode: "026", region: "Rift Valley" },
    { county: "Uasin Gishu", capital: "Eldoret", countyCode: "027", region: "Rift Valley" },
    { county: "Elgeyo Marakwet", capital: "Iten", countyCode: "028", region: "Rift Valley" },
    { county: "Nandi", capital: "Kapsabet", countyCode: "029", region: "Rift Valley" },
    { county: "Baringo", capital: "Kabarnet", countyCode: "030", region: "Rift Valley" },
    { county: "Laikipia", capital: "Rumuruti", countyCode: "031", region: "Rift Valley" },
    { county: "Nakuru", capital: "Nakuru", countyCode: "032", region: "Rift Valley" },
    { county: "Narok", capital: "Narok", countyCode: "033", region: "Rift Valley" },
    { county: "Kajiado", capital: "Kajiado", countyCode: "034", region: "Rift Valley" },
    { county: "Kericho", capital: "Kericho", countyCode: "035", region: "Rift Valley" },
    { county: "Bomet", capital: "Bomet", countyCode: "036", region: "Rift Valley" },
    { county: "Kakamega", capital: "Kakamega", countyCode: "037", region: "Western" },
    { county: "Vihiga", capital: "Mbale", countyCode: "038", region: "Western" },
    { county: "Bungoma", capital: "Bungoma", countyCode: "039", region: "Western" },
    { county: "Busia", capital: "Busia", countyCode: "040", region: "Western" },
    { county: "Siaya", capital: "Siaya", countyCode: "041", region: "Nyanza" },
    { county: "Kisumu", capital: "Kisumu", countyCode: "042", region: "Nyanza" },
    { county: "Homa Bay", capital: "Homa Bay", countyCode: "043", region: "Nyanza" },
    { county: "Migori", capital: "Migori", countyCode: "044", region: "Nyanza" },
    { county: "Kisii", capital: "Kisii", countyCode: "045", region: "Nyanza" },
    { county: "Nyamira", capital: "Nyamira", countyCode: "046", region: "Nyanza" },
    { county: "Nairobi", capital: "Nairobi", countyCode: "047", region: "Nairobi" }
];


export const headSalutation = [
    "Mr.", "Mrs.", "Miss.", "Ms.", "Prof.", "Dr.", "Eng.", "EGH", "H.E.", "Hon.", "Capt.", "Col.",
    "Maj.", "Rev.", "Bishop", "Sheikh", "Sir", "Dame",
].map((item) => ({
    label: item.toUpperCase(),
    value: item.toUpperCase(),
}));


export const officeType = ["President", "Deputy President"].map((item) => ({
    label: item,
    value: item,
}));

export const headTitle = ["Chief Executive Officer", "Director", "Manager","President","Chairperson"].map(
    (item) => ({
        label: item,
        value: item,
    })
);

export const tertiaryInstitutions = [
    "College","University","Technical Training Institute (TTI)","National Polytechnic",
    "Vocational Training Center (VTC)","Teacher Training College (TTC)","Medical Training College","Agricultural Training Institute",
    "Hospitality and Tourism College","Media and Communication College","Maritime Training Institute",
    "Aviation Training Institute","Law Training Institute","Accounting and Business Training Institute",
].map((item) => ({
    label: item,
    value: item,
}));

export const institutionHead = ["Vice Chancellor", "Principal", "Manager"].map(
    (item) => ({
        label: item,
        value: item,
    })
);

export const businessType = [
    "Private Limited Company","Public Limited Company","Partnership","Sole Proprietorship","Cooperative Society",
    "Non-Governmental Organization (NGO)","Trust","Association","Limited Liability Partnership (LLP)",
    "Holding Company","Subsidiary Company","Joint Venture","Franchise","Charitable Organization",
].map((item) => ({
    label: item,
    value: item,
}));


export const organization =["Presidency","County","Ministry","State Department","Parastatal","Commission","Board"].map(item=>({
    label:item,
    value:item
}))