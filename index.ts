import * as pulumi from "@pulumi/pulumi";
import * as google from "@pulumi/google-native";
import * as random from "@pulumi/random";

const config = new pulumi.Config("google-native");
const region = config.require("region");

const postgres = new google.sqladmin.v1.Instance("postgres", {
    region: region,
    databaseVersion: "POSTGRES_14",
    settings: {
        tier: "db-f1-micro",
        ipConfiguration: {
            ipv4Enabled: true,
            requireSsl: true,
            authorizedNetworks: [
                {
                    name: "all",
                    value: "0.0.0.0/0"
                },
            ],
        },
        backupConfiguration: {
            enabled: true,
            pointInTimeRecoveryEnabled: true,
        },
    },
});

const postgresCertificate = new google.sqladmin.v1.SslCert("postgres", {
    commonName: "postgres",
    instance: postgres.name,
});

const postgresUserPassword = new random.RandomPassword("postgres", {
    length: 16,
});

const postgresUser = new google.sqladmin.v1.User("postgres", {
    name: "postgres",
    password: postgresUserPassword.result,
    instance: postgres.name,
});

export const ca = postgres.serverCaCert.cert;
export const ipAddress = postgres.ipAddresses[0].ipAddress;
export const password = postgresUser.password;
export const key = postgresCertificate.cert;
