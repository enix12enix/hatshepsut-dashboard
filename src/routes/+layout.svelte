<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/main.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler-flags.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler-payments.min.css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler-vendors.min.css" />
</svelte:head>

<div class="page">

<div class="mb-3">
                <header class="navbar navbar-expand-md navbar-transparent d-print-none">
                  <div class="container-xl">
          
                    <!-- navbar logo -->
                    <div class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
						<a class="navbar-brand" href="/" aria-label="Hatshepsut">
					HATSHEPSUT DASHBOARD
				</a>
                    </div>
                

                    <div class="collapse navbar-collapse" id="navbar-menu">
                      <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                        <!-- navbar menu -->
                        <ul class="navbar-nav">
                          <!-- 1st item - Execution -->
                          <li class="nav-item active">
                            <a class="nav-link" href="/">
                              <span class="nav-link-icon d-md-none d-lg-inline-block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg></span>
                              <span class="nav-link-title">Execution</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </header>
</div>
	<div class="page-wrapper">
		{@render children?.()}
	</div>
</div>
