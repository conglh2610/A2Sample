using A2Sample.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace A2Sample.DAL
{
    public class TinyMarketContext: DbContext
    {
        public TinyMarketContext(DbContextOptions options): base(options) { }

        public DbSet<Category> Categories { get; set; }

    }
}
