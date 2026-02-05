using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;


namespace OnThisDay.Api.Infrastructure.Data.Conventions;

public static class SnakeCaseNamingConvention
{
    public static void Apply(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes()!)
        {
            //Table names
            var tableName = entity.GetTableName();
            if (tableName != null)
            {
                entity.SetTableName(ToSnakeCase(tableName));
            }

            // Columns
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));
            }

            //Keys 
            foreach (var key in entity.GetKeys())
            {
                var keyName = key.GetName();
                if (keyName != null)
                {
                    key.SetName(ToSnakeCase(keyName));
                }
            }

            //Foregin Keyes
            foreach (var fk in entity.GetForeignKeys())
            {
                var constraintName = fk.GetConstraintName();
                if (constraintName != null)
                {
                    fk.SetConstraintName(ToSnakeCase(constraintName));
                }
            }

            //indexes

            foreach (var index in entity.GetIndexes())
            {
                var dbName = index.GetDatabaseName();
                if (dbName != null)
                {
                    index.SetDatabaseName(ToSnakeCase(dbName));
                }
            }

        }
    }
    private static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;


        var result = new System.Text.StringBuilder();

        for (int i = 0; i < input.Length; i++)
        {
            var c = input[i];
            if (char.IsUpper(c))
            {
                if (i > 0) result.Append('_');
                result.Append(char.ToLowerInvariant(c));
            }
            else
            {
                result.Append(c);
            }
        }
        return result.ToString();
    }
}