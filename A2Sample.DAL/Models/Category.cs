using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace A2Sample.DAL.Models
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string SearchPattern { get; set; }
        [ForeignKey("ParentCategory")]
        public int? ParentId { get; set; }
        public virtual Category ParentCategory { get; set; }
    }
}
