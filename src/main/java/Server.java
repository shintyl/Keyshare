import static spark.Spark.*;

import spark.Spark;
import spark.utils.IOUtils;

public class Server {

//  private static Sql2o sql2o;
//
//  private static Sql2o getSql2o() {
//    if(sql2o == null) {
//      // create data source - update to use postgresql
//      try {
//        Properties props = getDbUrl(System.getenv("DATABASE_URL"));
//        sql2o = new Sql2o(new HikariDataSource(new HikariConfig(props)), new PostgresQuirks());
//        //sql2o = new Sql2o(props.getProperty("jdbcUrl"), props.getProperty("username"), props.getProperty("password"));
//      } catch(URISyntaxException | Sql2oException e) {
//        e.printStackTrace();
//      }
//
//      try (org.sql2o.Connection con = sql2o.beginTransaction()) {
//        con.createQuery(UsersSchema).executeUpdate();
//        con.createQuery(EventsSchema).executeUpdate();
//        con.createQuery(CalendarsSchema).executeUpdate();
//        con.createQuery(ConnectionsSchema).executeUpdate();
//        con.createQuery(AvailabilitiesSchema).executeUpdate();
//        con.commit();
//      } catch (Sql2oException e) {
//        e.printStackTrace();
//      }
//    }
//
//    return sql2o;
//  }
//
//  private static Properties getDbUrl(String databaseUrl) throws URISyntaxException {
//    Properties props = new Properties();
//    if (databaseUrl == null) {
//      Dotenv dotenv = Dotenv.load();
//      props.setProperty("username", dotenv.get("DEV_DB_USER"));
//      props.setProperty("password", dotenv.get("DEV_DB_PWORD"));
//      props.setProperty("jdbcUrl",  dotenv.get("DEV_DB_URL"));
//    } else {
//      URI dbUri = new URI(databaseUrl);
//
//      props.setProperty("username", dbUri.getUserInfo().split(":")[0]);
//      props.setProperty("password", dbUri.getUserInfo().split(":")[1]);
//      props.setProperty("jdbcUrl",  "jdbc:postgresql://" + dbUri.getHost() + ':'
//              + dbUri.getPort() + dbUri.getPath() + "?sslmode=require");
//    }
//
//    return props;
//  }

  final static int PORT_NUM = 7000;
  private static int getHerokuAssignedPort() {
    String herokuPort = System.getenv("PORT");
    if (herokuPort != null) {
      return Integer.parseInt(herokuPort);
    }
    return PORT_NUM;
  }

  public static void main(String[] args) {
    // set port number
    port(getHerokuAssignedPort());

    //getSql2o();

    staticFiles.location("/");

    get("", (req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });

    get("/", (req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });

    notFound((req, res) -> {
      res.status(200);
      res.type("text/html");

      return IOUtils.toString(Spark.class.getResourceAsStream("/index.html"));
    });
  }

}
