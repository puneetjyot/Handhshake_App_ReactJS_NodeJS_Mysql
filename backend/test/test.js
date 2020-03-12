var chai = require("chai"),
  chaiHttp = require("chai-http");
chai.use(chaiHttp);
const api_host = "http://localhost";
const api_port = "3001";
const api_url = api_host + ":" + api_port;

var expect = chai.expect;

it("Test server status", function(done) {
  chai
    .request(api_url)
    .get("/student/servercheck")
    .send()
    .end(function(err, res) {
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Welcome to Handshake server");
      done();
    });
});

it("Check login", function(done) {
  chai
    .request(api_url)
    .post("/student/login")
    .send({ student: { email: "p@k1.com", password: "kenakena" } })
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoicEBrMS5jb20iLCJpYXQiOjE1ODI3MzcxOTJ9.1_RixhYYpvFS-h4doEQEczZQwMDrFxF1xDnEl5cNKY4"
    )
    .end(function(err, res) {
      expect(res).to.have.status(201);
      expect(res.body.user.isLogin).to.equal(true);
      done();
    });
});

// it("Check register", function(done){
//     chai.request(api_url)
//     .post('/student/register')
//     .send({"student":{"email":"puneetjyotsingh@gnail.com","password":"puneet123","name":'Puneet','college':'UCI'}})
//     .end(function (err, res) {
//         expect(res).to.have.status(201);
//         expect(res.body.user.isRegister).to.equal(true);
//         done();
//     });
// })

it("Check if student objective is coming or not", function(done) {
  chai
    .request(api_url)
    .get("/student/journey")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoicEBrMS5jb20iLCJpYXQiOjE1ODI3MzcxOTJ9.1_RixhYYpvFS-h4doEQEczZQwMDrFxF1xDnEl5cNKY4"
    )
    .send()
    .end(function(err, res) {
      expect(res).to.have.status(201);

      done();
    });
});

// it("Check if student objective is coming or not", function(done) {
//   chai
//     .request(api_url)
//     .get("/company/")
//     .set(
//       "Authorization",
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoicEBrMS5jb20iLCJpYXQiOjE1ODI3MzcxOTJ9.1_RixhYYpvFS-h4doEQEczZQwMDrFxF1xDnEl5cNKY4"
//     )
//     .send()
//     .end(function(err, res) {
//       expect(res).to.have.status(200);

//       done();
//     });
//});

it("Check company profile", function(done) {
  chai
    .request(api_url)
    .get("/company/")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYXJteUBuYWdhcnJvLmNvbSIsImlhdCI6MTU4Mzk3NjUzN30.XqUu7AqIFckRDYWQ_Jb5fGsSYRdpWxonqVeymuME-XU"
    )

    .send()
    .end(function(err, res) {
     // expect(res).to.have.status(201);
      expect(res.body.company).to.be.a("Object");
      expect(res.body.company.company_profile.phone).to.equal("2017361387");
      done();
    });
});

// it("Checking if restaurant search returns atleast one restaurant", function(done){
//     chai.request(api_url)
//     .get('/api/search?searchKey=a')
//     .send()
//     .end(function (err, res) {
//         expect(res).to.have.status(200);
//         expect(res.body.content).to.be.a('Array');
//         expect(res.body.content).to.have.length.greaterThan(1);
//         done();
//     });
// })

// it("Checking if restaurant order history returns atleast one order", function(done){
//     chai.request(api_url)
//     .get('/api/order/restaurant?rest_id=10')
//     .send()
//     .end(function (err, res) {
//         expect(res).to.have.status(200);
//         expect(res.body.msgDesc).to.be.a('Array');
//         expect(res.body.msgDesc).to.have.length.greaterThan(1);
//         done();
//     });
// })

// it("Checking if user is able to get items sold by a restaurant in details view", function(done){
//     chai.request(api_url)
//     .get('/api/seller/menu?rest_id=10')
//     .send()
//     .end(function (err, res) {
//         expect(res).to.have.status(200);
//         expect(res.body.msgDesc).to.be.a('Array');
//         expect(res.body.msgDesc).to.have.length.greaterThan(1);
//         done();
//     });
// })
