using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helper
{
    public class Paginationheader
    {
        public Paginationheader(int currentPage, int itemsPerpage, int totalItems, int totalPages)
        {
            CurrentPage = currentPage;
            ItemsPerpage = itemsPerpage;
            TotalItems = totalItems;
            TotalPages = totalPages;
        }

        public int CurrentPage { get; set; }
        public int ItemsPerpage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}