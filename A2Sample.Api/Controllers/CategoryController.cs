using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using A2Sample.DAL.Models;
using A2Sample.DAL.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace A2Sample.Api
{
    
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private readonly IRepository<Category> _repoCategory;

        public CategoryController(IRepository<Category> repoCategory)
        {
            this._repoCategory = repoCategory;
        }

        [HttpGet("getcategories")]
        public IEnumerable<Category> GetCategory()
        {
            return _repoCategory.GetAll();
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public Category Get(int id)
        {
            return _repoCategory.Get(id);
        }

        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
