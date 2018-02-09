using A2Sample.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace A2Sample.DAL.Services
{
    public interface IRepository<T> where T : BaseEntity
    {
        IEnumerable<T> GetAll();
        T Get(int id);
        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
    }

}
